package web

import "embed"

//go:embed all:out
var FrontendFS embed.FS
