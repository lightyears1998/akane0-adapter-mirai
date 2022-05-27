import AkaneAdapterMirai from ".";

const adapter = new AkaneAdapterMirai();
console.log(adapter);

adapter.start();

setTimeout(() => {
  adapter.sendMessage({ command: "friendList" }, msg => console.log(msg));
}, 4000);
