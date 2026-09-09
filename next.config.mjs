/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/Home/AboutUs',
        destination: '/about',
        permanent: false,
      },
      {
        source: '/Home/ContactUs',
        destination: '/contact',
        permanent: false,
      },
      {
        source: '/Home/Fa',
        destination: '/faq',
        permanent: false,
      },
      {
        source: '/Home/ProcessFlow',
        destination: '/process-flow',
        permanent: false,
      },
      {
        source: '/Home/NodalPgOfficers',
        destination: '/nodal-officers',
        permanent: false,
      },
      {
        source: '/Home/NodalPgOfficersState',
        destination: '/nodal-officers',
        permanent: false,
      },
      {
        source: '/Home/NodalAuthorityForAppeal',
        destination: '/appeals',
        permanent: false,
      },
      {
        source: '/Home/LodgeGrievance',
        destination: '/citizen/report',
        permanent: false,
      },
      {
        source: '/Appeal/Status',
        destination: '/track?type=appeal',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
