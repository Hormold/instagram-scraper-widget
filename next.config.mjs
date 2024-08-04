/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				source: '/api/widget',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: "frame-ancestors *",
					},
				],
			},
			{
				source: '/api/proxy',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*',
					},
				],
			},
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
				port: '',
				pathname: '**',
			},
		],
	},
	crossOrigin: 'anonymous',
}


export default nextConfig;
