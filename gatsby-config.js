module.exports = {
  siteMetadata: {
    title: `構造とデジタル_最新版_Final(1)`,
    subtitle: `技術記事とかポエムとか`,
    description: `構造設計とデジタルデザインにかかわりそうなものを気が向いたときに書きます。`,
    author: `@hiron`,
    image: `https://hiron.dev/icons/icon-256x256.png`,
    siteUrl: `https://hiron.dev`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-178476251-1",
        head: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `diary`,
        path: `${__dirname}/src/diary`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `article`,
        path: `${__dirname}/src/articles`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-reading-time`, {
          resolve: `gatsby-remark-prismjs`,
          options: {
            aliases: { sh: "bash", js: "javascript" },
            showLineNumbers: true,
            additionalLangs: [`language-rust`],
          }
        }, {
            resolve: `gatsby-remark-og-image`,
            options: {
              output: {
                directory: '',
                fileName: 'thumbnail.png'
              },
              image: {
                width: 1200,
                height: 630,
                // backgroundImage: './src/assets/images/og-background.jpg'
                backgroundColor: '#e2eadd',
              },
              style: {
                title: {
                  fontFamily: 'Noto Sans JP',
                  fontColor: '#333333',
                  fontWeight: 'Bold',
                  fontSize: 64,
                  paddingTop: 100,
                  paddingBottom: 200,
                  paddingLeft: 150,
                  paddingRight: 150,
                },
                author: {
                  fontFamily: 'Noto Sans JP',
                  fontColor: '#333333',
                  fontWeight: 'Bold',
                  fontSize: 42,
                }
              },
              meta: {
                title: '',
                author: 'hrntsm'
              },
              fontFile: [
                {
                  path: require.resolve('./src/assets/fonts/NotoSansJP-Bold.otf'),
                  family: 'Noto Sans JP',
                  weight: 'bold',
                },
              ],
              iconFile: require.resolve('./static/twittercard/image.png'),
              timeout: 10000,
            },
          }],
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/*": [
            "Strict-Transport-Security: max-age=63072000"
          ]
        }, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
}
