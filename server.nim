import asynchttpserver, asyncdispatch

let server = newAsyncHttpServer()
server.listen(Port(80))

echo "Server started on port 80"

proc requestCallBack(req: Request) {.async, gcsafe.} =
    let 
        txtHeaders = {"Content-type": "text/plain"}
        pngHeaders = {"Content-type": "image/png"}
        jsHeaders = {"Content-type": "text/javascript"}
        svgHeaders = {"Content-type": "image/svg+xml"}



    case req.url.path:
        of "/":
            let
                indexPage = readfile("index.html")
                htmlHeaders = {"Content-type" : "text/html; charset=utf-8"}

            await req.respond(Http200, indexPage, htmlHeaders.newHttpHeaders())

        of "/client.js":
            let
                clientJs = readfile("client.js")

            await req.respond(Http200, clientJs, jsHeaders.newHttpHeaders())

        of "/jquery.js":
            let jquery = readfile("jquery.js")

            await req.respond(Http200, jquery, jsHeaders.newHttpHeaders())
        of "/styles.css":
            let
                styleCss = readfile("styles.css")
                cssHeaders = {"Content-type": "text/css"}

            await req.respond(Http200, styleCss, cssHeaders.newHttpHeaders())

        of "/new.svg":
            let 
                logoSvg = readfile("new.svg")

            await req.respond(Http200, logoSvg, svgHeaders.newHttpHeaders())

        of "/copy.svg":
            let 
                copySvg = readfile("copy.svg")

            await req.respond(Http200, copySvg, svgHeaders.newHttpHeaders())


while true:
    if server.shouldAcceptRequest:
        waitFor server.acceptRequest(requestCallBack)
    else:
        waitFor sleepAsync(500)
