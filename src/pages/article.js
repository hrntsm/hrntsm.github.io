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

const ArticleDate = styled.h5`
  display: inline;
  color: #606060;
`

const TagsHeader = styled.h3`
  display: inline;
  color: #606060;
`

const MarkerHeader = styled.h3`
  display: inline;
  border-radius: 1em 0 1em 0;
  background-image: linear-gradient(
    -100deg,
    rgba(209, 245, 255, 0.15),
    rgba(209, 245, 255, 1.0) 100%,
    rgba(209, 245, 255, 0.45)
  );
`

const ReadingTime = styled.h5`
  display: inline;
  color: #606060;
`

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Article" />
      <Content>
        <h1>Article</h1>
        <hr></hr>
        <p>技術記事です。"構造とデジタル" というブログや Qiita、Zenn.dev などにこれまで書いてきた記事をこちらにまとめました。</p>
        <hr></hr>
        <TagsHeader>
          <Link
            to={"/article-tags"}
            css={css`
                  text-decoration: none;
                  color: inherit;
                `}
          >
            All Article Tags Page(WIP)
          </Link>
        </TagsHeader><br/><br/>
        <hr></hr>
        {data.allMarkdownRemark.edges
          .filter(({ node }) => {
            const rawDate = node.frontmatter.rawDate
            const date = new Date(rawDate)
            return date < new Date()
          })
          .map(({ node }) => (
            <div key={node.id}>
              <Link
                to={node.frontmatter.path}
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <MarkerHeader>{node.frontmatter.title} </MarkerHeader>
                <div>
                  <ArticleDate>{node.frontmatter.date}</ArticleDate>
                  <ReadingTime> - {node.fields.readingTime.text}</ReadingTime>
                  <ArticleDate> - Tags: {node.frontmatter.article_tags + ""}</ArticleDate>
                </div>
                <p>{node.excerpt}</p>
              </Link>
            </div>
          ))}
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
      filter: { frontmatter: { draft: { eq: false } }, fields: {collection : { eq: "article"} } }
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
            article_tags
          }
          fields {
            collection
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
