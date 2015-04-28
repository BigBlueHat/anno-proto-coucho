function(doc, req) {
  return {
    'headers': {
      'Allow': 'HEAD, OPTIONS, GET',
      'Accept-Post': 'text/turtle, application/ld+json',
      'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
            + ",\n "
            + '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    },
    'body': ''
  };
}
