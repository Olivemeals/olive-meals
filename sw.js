self.addEventListener("install", e=>{
 e.waitUntil(
  caches.open("olive-cache").then(cache=>{
   return cache.addAll(["/","/index.html","/styles.css","/app.js"])
  })
 )
})