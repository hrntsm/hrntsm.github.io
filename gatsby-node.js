const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)


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

  const blogPostTemplate = path.resolve(`src/templates/diary-post.js`)
  const tagTemplate = path.resolve(`src/templates/diary-tags.js`)

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
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    result.data.postRemark.edges
      .filter(({ node }) => !node.frontmatter.draft)
      .forEach(({ node }) => {
        createPage({
          path: node.frontmatter.path,
          description: node.frontmatter.description,
          component: blogPostTemplate,
          slug: node.fields.slug,
          context: {},
        })
      })
    result.data.tagsGroup.group
      .forEach(tag => {
        createPage({
          path: `/diary-tags/${_.kebabCase(tag.fieldValue)}/`,
          component: tagTemplate,
          context: {
            tag: tag.fieldValue,
          },
        })
      })
  })
}
