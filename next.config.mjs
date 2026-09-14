/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/dev.db'],
    },
  },
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
        source: '/Home/Faq',
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
      {
        source: '/geotag',
        destination: '/citizen/report',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
