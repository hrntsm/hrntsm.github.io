import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Contact" />
      <Content>
        <h1>Contact</h1>
        <p>
          お気軽にお問い合わせください。
        </p>
        <h3>Form</h3>
        <a
          href={
            "https://docs.google.com/forms/d/e/1FAIpQLSc-tO01F1Pf0LX9rhbzVvHQjcGBduUACzyeTS2uQehNq8JoBQ/viewform"
          }
        >
          お問い合わせフォーム
        </a>
        <p />
        <h3>E-mail</h3>
        <p>contact(a)hrntsm.com (a) を @ に変換してください</p>
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
