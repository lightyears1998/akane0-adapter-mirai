import AkaneAdapterMirai from ".";

const adapter = new AkaneAdapterMirai();
adapter.start();

setTimeout(() => {
  adapter.sendMessage({ command: "friendList" }, msg => console.log(msg));
}, 4000);
