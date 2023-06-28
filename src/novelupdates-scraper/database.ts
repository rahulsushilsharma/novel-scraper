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
  console.log(docs);
  return (docs[0]?.link as string) || null;
}

async function updateLastUrl(url: string) {
  const lastUrl = await getLastUrl();
  // if (lastUrl) {
  await lastLink.updateAsync({ link: lastUrl }, { link: url }, {});
  // } else {
  //   await updateParsedLinks(url);
  // }
}

async function saveNovelLinks(url: string, data: any) {
  try {
    return await novelLinks.insertAsync({
      _id: url,
      data: data,
      parsed: false,
    });
  } catch {
    return await novelLinks.updateAsync(
      { _id: url },
      {
        _id: url,
        data: data,
        parsed: false,
      },
      {}
    );
  }
}
// await updateParsedLinks("https://www.novelupdates.com/novelslisting/?sort=2&order=1&status=1");
// getLastUrl()

export {
  updateParsedLinks,
  saveHtml,
  getLastUrl,
  updateLastUrl,
  saveNovelLinks,
};
