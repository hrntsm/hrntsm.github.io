const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)
const { node } = require("prop-types")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
        node,
        name: `slug`,
        value: slug,
    })

    const parent = getNode(node.parent)
    createNodeField({
        node,
        name: `collection`,
        value: parent.sourceInstanceName,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const diaryPostTemplate = path.resolve(`src/templates/diary-post.js`)
  const articlePostTemplate = path.resolve(`src/templates/article-post.js`)
  const diaryTagTemplate = path.resolve(`src/templates/diary-tags.js`)
  const articleTagTemplate = path.resolve(`src/templates/article-tags.js`)

  return graphql(`
    {
      postRemark: allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
              draft
              date
              tags
              article_tags
            }
            fields {
              slug
              collection
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark {
        group(field: frontmatter___tags){
          fieldValue
        }
      }
      articleTagsGroup: allMarkdownRemark {
        group(field: frontmatter___article_tags){
          fieldValue
        }
      }
    }
  `).then(result => {
      if (result.errors) {
        return Promise.reject(result.errors)
      }
      result.data.postRemark.edges
        .filter(({ node }) => !node.frontmatter.draft && node.fields.collection == "article")
        .forEach(({ node }) => {
          createPage({
            path: node.frontmatter.path,
            description: node.frontmatter.description,
            component: articlePostTemplate,
            slug: node.fields.slug,
            context: {},
          })
        })
      result.data.articleTagsGroup.group
        .forEach(tag => {
          createPage({
            path: `/article-tags/${_.kebabCase(tag.fieldValue)}/`,
            component: articleTagTemplate,
            context: {
              tag: tag.fieldValue,
            },
          })
        })
      result.data.postRemark.edges
        .filter(({ node }) => !node.frontmatter.draft && node.fields.collection == "diary")
        .forEach(({ node }) => {
          createPage({
            path: node.frontmatter.path,
            description: node.frontmatter.description,
            component: diaryPostTemplate,
            slug: node.fields.slug,
            context: {},
          })
        })
      result.data.tagsGroup.group
        .forEach(tag => {
          createPage({
            path: `/diary-tags/${_.kebabCase(tag.fieldValue)}/`,
            component: diaryTagTemplate,
            context: {
              tag: tag.fieldValue,
            },
          })
        })
    }
  )
}
