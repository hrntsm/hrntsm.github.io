// plugins/gatsby-remark-og-image/index.js

const catchy = require('catchy-image')

module.exports = async ({ markdownNode }, pluginOptions) => {
  
  // gatsby-config.jsの設定情報とマークダウンのメタデータを画像生成ライブラリの引数に渡す
  const result = await catchy.generate({
    ...pluginOptions,
    output: {
      ...pluginOptions.output,
      directory: `./public/image/forOGP/${markdownNode.fields.slug}`,
      fileName: pluginOptions.output.fileName,
    },
    meta: {
      ...pluginOptions.meta,
      title: markdownNode.frontmatter.title
    }
  })

  console.info(`gatsby-remark-og-image: Successful generated: ${result}`)
}
