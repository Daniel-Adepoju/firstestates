import { MetadataRoute } from "next";
import { userAgent } from "next/server";


export default function robots(): MetadataRoute.Robots {
    return {
        rules:
            {
                userAgent: '*',
                allow: '/',
                disallow: '/private/'
            }
        ,
        sitemap: `${process.env.BASE_URL}/sitemap.xml`,
    };
}