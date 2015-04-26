# LDP on CouchDB

[Apache CouchDB](http://couchdb.apache.org/)'s HTTP API is quite
similar to LDP's Basic Container system.

This project closes the loop by providing a set of CouchApp
functions (`_update`, `_show`, etc) that add the remaining
LDP specific semantics.

## Usage

1. Copy `config.json.sample` to `config.json`
2. Change `config.json` to match your setup.
3. `gulp` (or only `gulp apps` or `gulp docs`)
4. Send LDP requests to the URL you set in `config.json`
   plus `_design/ldp/_rewrite/`
5. (optional) Setup a Virtual Host to make the URL above
   prettier.

## License

Apache License 2.0
