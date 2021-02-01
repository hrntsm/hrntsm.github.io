import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import styled from "@emotion/styled"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const MarkerHeader = styled.h3`
  display: inline;
  border-radius: 1em 0 1em 0;
  background-image: linear-gradient(
    -100deg,
    rgba(209, 255, 209, 0.15),
    rgba(209, 255, 209, 0.8) 100%,
    rgba(209, 255, 209, 0.25)
  );
`

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO
       title="Links"
       description="外部サイトへのリンク"
       />
      <Content>
        <h1>Links</h1>
        <a href="https://github.com/hrntsm"
           css={css`
                  text-decoration: none;
                  color: inherit;
                `}>
          <MarkerHeader>GitHub</MarkerHeader>
        </a>
        <br/><br/>
        <a href="https://www.youtube.com/channel/UC6k39WVNArYdGew6NeolxJA"
           css={css`
                  text-decoration: none;
                  color: inherit;
                `}>
          <MarkerHeader>Youtube Channel</MarkerHeader>
        </a>
      </Content>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { eq: false } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            rawDate: date
            path
          }
          fields {
            slug
            readingTime {
              text
            }
          }
          excerpt
        }
      }
    }
  }
`
