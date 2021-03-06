import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"
import Layout from "../components/layout"
import SEONOINDEX from "../components/seoNoindex"
import {
  FacebookShareButton,
  FacebookIcon,
  HatenaShareButton,
  HatenaIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const MarkedHeader = styled.h1`
  display: inline;
  border-radius: 1em 0 1em 0;
  background-image: linear-gradient(
    -100deg,
    rgba(209, 245, 255, 0.15),
    rgba(209, 245, 255, 1.0) 100%,
    rgba(209, 245, 255, 0.45)
  );
`

const HeaderDate = styled.h3`
  margin-top: 10px;
  color: #606060;
`

// STYLE THE TAGS INSIDE THE MARKDOWN HERE
const MarkdownContent = styled.div`
  a {
    text-decoration: none;
    position: relative;

    background-image: linear-gradient(
      rgba(209, 245, 255, 0.3),
      rgba(209, 245, 255, 1.0)
    );
    background-repeat: no-repeat;
    background-size: 100% 0.2em;
    background-position: 0 88%;
    transition: background-size 0.25s ease-in;
    &:hover {
      background-size: 100% 88%;
    }
  }

  a > code:hover {
    text-decoration: underline;
  }
`

export default ({ data }) => {
  const post = data.markdownRemark
  const url = "https://hiron.dev" + post.frontmatter.path
  const title = post.frontmatter.title
  return (
    <Layout>
      <SEONOINDEX
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        keywords={post.frontmatter.tags}
        image={"https://hiron.dev/image/forOGP" + post.fields.slug + "thumbnail.png"}
      />
      <Content>
        <MarkedHeader>{post.frontmatter.title}</MarkedHeader>
        <HeaderDate>
          {post.frontmatter.date} - {post.fields.readingTime.text} - Tags: {post.frontmatter.tags + ""}
        </HeaderDate>
        <MarkdownContent dangerouslySetInnerHTML={{ __html: post.html }} />
        <div>
          <FacebookShareButton url={url}>
            <FacebookIcon size={36} round />
          </FacebookShareButton>

          <HatenaShareButton title={title} url={url} >
            <HatenaIcon size={36} round />
          </HatenaShareButton>

          <TwitterShareButton title={title} via="hiron_rgkr" url={url} >
            <TwitterIcon size={36} round />
          </TwitterShareButton>
        </div>
      </Content>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 160)
      frontmatter {
        date(formatString: "DD MMMM, YYYY")
        path
        title
        tags
      }
      fields {
        readingTime {
          text
        }
        slug
        collection
      }
    }
  }
`
