function(head, req){
  start({
    'headers': {
      'Content-Type': 'text/turtle',
      'Accept-Post': 'text/turtle, application/ld+json',
      'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
            + "\n"
            + '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    }
  });

  send('@prefix ldp: <http://www.w3.org/ns/ldp#>.');

  send('</' + req.info.db_name + '/> a ldp:BasicContainer;');
  send('  ldp:contains');
  var ids = [];
  while (row = getRow()) {
    ids.push(row.id);
  }
  send(' <' + ids.join('>, <') + '>.');
}
