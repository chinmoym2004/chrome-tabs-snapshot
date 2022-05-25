let color = '#3aa757';
let snaps = [];
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  chrome.storage.local.set({ snaps });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


// chrome.runtime.onInstalled.addListener((reason) => {
//   if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
//     chrome.tabs.create({
//       url: 'onboarding.html'
//     });
//   }
// });