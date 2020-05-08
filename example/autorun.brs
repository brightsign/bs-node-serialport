sub main()

  r=CreateObject("roRectangle", 0,0,1920,1080)
  is = {
      port: 3000
  }
  config = {
      nodejs_enabled: true
      inspector_server: is
      brightsign_js_objects_enabled: true
      url: "file:///sd:/index.html"
  }
  h=CreateObject("roHtmlWidget", r, config)
  h.Show()

  msgPort = createobject("roMessagePort")

  h.setPort(msgPort)

  while true
    msg = Wait(0, msgPort)
  end while

end sub