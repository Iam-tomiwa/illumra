import { defineQuery, groq } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    hero{
      attentionLabel,
      attentionIcon,
      headline,
      summary,
      primaryAction{
        label,
        href,
        icon
      },
      secondaryAction{
        label,
        href,
        icon
      },
      backgroundImage{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      }
    },
    controlSolutions{
      title,
      subtitle,
      features[]{
        icon,
        title,
        description,
        url
      }
    },
    trustedBy{
      heading,
      logos[]{
        name,
        href,
        logo{
          source,
          altText,
          externalUrl,
          image{
            asset,
            crop,
            hotspot
          }
        }
      }
    },
    about{
      title,
      body[]{
        ...,
        children[]{
          ...
        }
      },
      cta{
        label,
        href,
        icon
      },
      background{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      features[]{
        icon,
        title,
        description
      }
    }
  }
`);

export const categoryQuery = defineQuery(`
  *[_type == "productCategory"] {
    _id,
    "slug": slug.current,
    title,
    description
  } | order(_createdAt desc)  
`);

export const productFrequencyQuery = defineQuery(`
  *[_type == "productFrequency"] {
    _id,
    "value": value,
    label
  } | order(_createdAt desc)  
`);

export const productProtocolQuery = defineQuery(`
  *[_type == "productProtocol"] {
    _id,
    "value": value,
    label
  } | order(_createdAt desc)
`);
export const productVoltageQuery = defineQuery(`
  *[_type == "productVoltage"] {
    _id,
    "value": value,
    label
  } | order(_createdAt desc)
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const productsQuery = /* groq */ `
   _id,
    title,
    "slug": slug.current,
    shortDescription,
    "image": images[0]{ 
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
    },
    "category": category->slug.current,
    "sku": sku,
     colors[]{
      name,
      partNumber,
      hex
    },
`;
export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && featureTag == "featured"]{
   ${productsQuery}
  } | order(_createdAt desc)[0...8]
`);

export const relevantProductsQuery = defineQuery(`
  *[_type == "product" && category->slug.current == $category && _id != $excludeId]{
   ${productsQuery}
  } | order(_createdAt desc)[0...4]
`);

export const allProductsQuery = defineQuery(`
  *[_type == "product"]{
   ${productsQuery}
  } | order(_createdAt desc)
`);

export const FILTERED_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(
    *[
      _type == "product" &&
      (
        !defined($search) ||
        $search == "" ||
        coalesce(title, "") match $searchWildcard ||
        coalesce(sku.current, "") match $searchWildcard
      ) &&
      (
        !defined($category) ||
        $category == "" ||
        category->slug.current == $category
      ) &&
      (
        !defined($voltage) ||
        $voltage == "" ||
        voltage->value == $voltage
      ) &&
      (
        !defined($frequency) ||
        $frequency == "" ||
        frequency->value == $frequency
      ) &&
      (
        !defined($protocols) ||
        count($protocols) == 0 ||
        count((protocols[]->value)[@ in $protocols]) > 0
      )
    ]
  )
  `);

export const PRODUCT_QUERY = defineQuery(`
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      sku,
      shortDescription,
      body[]{
        ...,
        children[]{
          ...
        }
      },
      "category": category->{
        _id,
        title,
        "slug": slug.current
      },
      "voltage": voltage->{ _id, label, value },
      "frequency": frequency->{ _id, label, value },
      "protocols": protocols[]->{ _id, label, value },
      featureTag,
      colors[]{
        name,
        partNumber,
        hex
      },
      images[]{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      video{
        title,
        externalUrl
      },
      specifications[defined(label) && defined(value)]{
        _type,
        label,
        value
      },
      downloads[defined(title)]{
        _type,
        title,
        file{
          asset->{
            _id,
            url,
            originalFilename,
            size
          }
        },
        externalUrl
      },
      applications[defined(url)]{
        _type,
        title,
        url
      },
      wiringDiagrams[defined(title)]{
        _type,
        title,
        file{
          asset->{
            _id,
            url,
            originalFilename,
            size
          }
        },
        externalUrl
      }
    }
    `);

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0]{
    content{
      heroDescription,
      paragraphs[]{
        ...,
        children[]{
          ...
        }
      }
    },
    companyInfo{
      overview[]{
        ...,
        children[]{
          ...
        }
      },
      email,
      phone,
      headquarters,
      satelliteOffice
    }
  }
`);
