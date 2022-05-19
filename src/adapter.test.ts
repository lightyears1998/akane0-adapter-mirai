import AkaneAdapterMirai from ".";

const adapter = new AkaneAdapterMirai();
adapter.start();

// adapter.sendWebsocketMessage("sendFriendMessage");

setTimeout(() => {
  adapter.stop();
}, 4000);
