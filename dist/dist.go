package dist

//go:generate togo http -package dist -output dist_gen.go -input ../build/default/** -trim-prefix "../build/default" --exclude "bower_components/webcomponentsjs/(.+)"
