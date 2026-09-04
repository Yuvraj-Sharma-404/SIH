var SessionManager = (function () {
    var hub;
    var sessionTimer;
    var timeoutTimer;
    var remainingTime;
    var warningShown = false;
    var lastActivityTime = 0;

    function formatTime(milliseconds) {
        var totalSeconds = Math.floor(milliseconds / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    function updateTimerDisplay() {
        var timerElement = $('#sessionTimer');
        var timeStr = formatTime(remainingTime);
        timerElement.text(timeStr);

        // Update timer color based on remaining time
        if (remainingTime <= 180000) { // 3 minutes
            timerElement.removeClass('warning danger').addClass('danger');
        } else if (remainingTime <= 300000) { // 5 minutes
            timerElement.removeClass('warning danger').addClass('warning');
        } else {
            timerElement.removeClass('warning danger');
        }
    }

    function updateSessionTimer() {
        if (remainingTime > 0) {
            remainingTime -= 1000;
            updateTimerDisplay();
            
            // Show warning popup 3 minutes before expiration
            if (remainingTime <= 180000 && !warningShown) {
                showTimeoutWarning();
                warningShown = true;
            }
            
            if (remainingTime <= 0) {
                handleSessionExpiration();
            }
        }
    }

    function showTimeoutWarning() {
        $('#divPopupTimeOut').show();
        $('#CountDownHolder').text(formatTime(remainingTime));
    }

    function hideTimeoutWarning() {
        $('#divPopupTimeOut').hide();
        warningShown = false;
        if (timeoutTimer) {
            clearInterval(timeoutTimer);
        }
    }

    function handleSessionExpiration() {
        stopTimers();
        //window.location.href = window.loginUrl;
        window.location.href = window.timeoutUrl;
    }

    function initializeSignalR() {
        hub = $.connection.sessionHub;
        
        hub.client.handleSessionExpired = function () {
            handleSessionExpiration();
        };

        $.connection.hub.start().done(function () {
            if (window.userCode) {
                hub.server.joinSessionGroup(window.userCode);
            }
        });

        // Handle disconnection and reconnection
        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                $.connection.hub.start();
            }, 5000);
        });
    }

    function extendSession() {
        var now = Date.now();
        // Throttle the extend session calls to once per minute
        if (now - lastActivityTime < 60000) {
            return;
        }
        lastActivityTime = now;
        $.ajax({
            type: 'GET',
            url: window.extendUrl,
            global: false, //this prevents triggering ajaxStart/ajaxStop handlers that will prevent loading spinner.
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    remainingTime = response.remainingTime;
                    hideTimeoutWarning();
                    updateTimerDisplay();
                } else {
                    handleSessionExpiration();
                }
            },
            error: function () {
                handleSessionExpiration();
            }
        });
    }

    function startTimer() {
        stopTimers();
        sessionTimer = setInterval(updateSessionTimer, 1000);
    }

    function stopTimers() {
        if (sessionTimer) clearInterval(sessionTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
    }

    function init(initialSessionTime) {
        remainingTime = initialSessionTime;
        initializeSignalR();
        startTimer();
        updateTimerDisplay();

        // Bind event handlers
        $('#keepAlive').click(extendSession);
        $('#hidePopup').click(hideTimeoutWarning);

        // Update session on any AJAX request
        $(document).ajaxSend(function (event, jqXHR, settings) {
            if (settings.url !== window.extendUrl) {
                extendSession();
            }
        });

        // Handle user activity
        var activityEvents = 'mousedown keydown scroll';
        $(document).on(activityEvents, function () {
            extendSession();
        });
    }

    return {
        init: init,
        extendSession: extendSession,
        stopTimers: stopTimers
    };
})();