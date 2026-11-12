const CACHE='jarvis-v2';
const FILES=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('jarvis-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request);
      if(response&&response.ok)cache.put(event.request,response.clone());
      return response;
    }catch(error){
      const cached=await cache.match(event.request);
      if(cached)return cached;
      if(event.request.mode==='navigate')return cache.match('./index.html');
      throw error;
    }
  })());
});