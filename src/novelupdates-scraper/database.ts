import Datastore from "@seald-io/nedb";

const lastLink = new Datastore({
  filename: "../database/novelupdates/lastLink.db",
});

const Html = new Datastore({
  filename: "../database/novelupdates/Html.db",
});

const novelLinks = new Datastore({
  filename: "../database/novelupdates/novelLinks.db",
});
try {
  await lastLink.loadDatabaseAsync();
  await Html.loadDatabaseAsync();
  await novelLinks.loadDatabaseAsync();
  console.log("loaded");
} catch (error) {
  console.log(error);
}

async function updateParsedLinks(link: string) {
  return await lastLink.insertAsync({ link: link });
}

async function saveHtml(link: string, page: string) {
  return await Html.insertAsync({ link: link, page: page });
}

async function getLastUrl() {
  const docs = await lastLink.findAsync({});
  return docs[0]?.link;
}

async function updateLastUrl(url: string) {
  const lastUrl = await getLastUrl();
  if (lastUrl) {
    await lastLink.updateAsync({ link: lastUrl }, { link: url }, {});
  } else {
    await updateParsedLinks(url);
  }
}

async function saveNovelLinks(url: string, data: any) {
  return await novelLinks.insertAsync({ url: url, data: data, parsed: false });
}

export {
  updateParsedLinks,
  saveHtml,
  getLastUrl,
  updateLastUrl,
  saveNovelLinks,
};
