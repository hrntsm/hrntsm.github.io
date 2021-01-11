import React from "react"
import PropTypes from "prop-types"


import Layout from "../components/layout"
import SEO from "../components/seo"

// Utilities
import kebabCase from "lodash/kebabCase"

// Components
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"

const ArticleTagsPage = ({
                    data: {
                      allMarkdownRemark: { group },
                      site: {
                        siteMetadata: { title },
                      },
                    },
                  }) => (
  <Layout>
    <SEO title="Article Tags" />
    <div>
      <div>
        <h1>Article Tags</h1>
        <ul>
          {group.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={`/article-tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Layout>
)

ArticleTagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default ArticleTagsPage

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(limit: 2000) {
            group(field: frontmatter___article_tags) {
                fieldValue
                totalCount
            }
        }
    }
`