#!/bin/sh
docker run --rm -v $PWD:/app anoff/hugo-asciidoctor hugo --gc --minify -d _site -b //localhost:5000