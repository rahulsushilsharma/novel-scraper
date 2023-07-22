import Datastore from "@seald-io/nedb";

/**
 * Represents the datastore for the last link.
 */
const lastLink = new Datastore({
  filename: "../database/novelupdates/lastLink.db",
});

/**
 * Represents the datastore for HTML data.
 */
const Html = new Datastore({
  filename: "../database/novelupdates/Html.db",
});

/**
 * Represents the datastore for novel links.
 */
const novelLinks = new Datastore({
  filename: "../database/novelupdates/novelLinks.db",
});

/**
 * Represents the datastore for novel metadata.
 */
const novelMeta = new Datastore({
  filename: "../database/novelupdates/novelMeta.db",
});

try {
  await lastLink.loadDatabaseAsync();
  await Html.loadDatabaseAsync();
  await novelLinks.loadDatabaseAsync();
  await novelMeta.loadDatabaseAsync();
  console.log("loaded");
} catch (error) {
  console.log(error);
}

/**
 * Updates the parsed links with the provided link.
 * @param link - The link to update.
 * @returns A promise that resolves when the operation is complete.
 */
async function updateParsedLinks(link: string) {
  return await lastLink.insertAsync({ link: link });
}

/**
 * Saves the HTML data with the provided link.
 * @param link - The link associated with the HTML data.
 * @param page - The HTML data to save.
 * @returns A promise that resolves when the operation is complete.
 */
async function saveHtml(link: string, page: string) {
  return await Html.insertAsync({ link: link, page: page });
}

/**
 * Retrieves the last URL from the datastore.
 * @returns The last URL as a string, or null if not found.
 */
async function getLastUrl() {
  const docs = await lastLink.findAsync({});
  console.log(docs);
  return (docs[0]?.link as string) || null;
}

/**
 * Updates the last URL with the provided URL.
 * @param url - The URL to update.
 * @returns A promise that resolves when the operation is complete.
 */
async function updateLastUrl(url: string) {
  const lastUrl = await getLastUrl();
  await lastLink.updateAsync({ link: lastUrl }, { link: url }, {});
}

/**
 * Saves the novel links with the provided URL and data.
 * @param url - The URL associated with the novel links.
 * @param data - The novel links data to save.
 * @returns A promise that resolves when the operation is complete.
 */
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

/**
 * Saves the novel metadata with the provided URL and data.
 * @param url - The URL associated with the novel metadata.
 * @param data - The novel metadata to save.
 * @returns A promise that resolves when the operation is complete.
 */
async function saveNovelMeta(url: string, data: any) {
  try {
    return await novelMeta.insertAsync({
      _id: url,
      data: data,
      parsed: false,
    });
  } catch {
    return await novelMeta.updateAsync(
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

/**
 * Retrieves the unparsed data from the novelLinks datastore.
 * @returns A promise that resolves with the unparsed data.
 */
async function getUnparsedData() {
  return await novelLinks.findAsync({ parsed: false });
}

/**
 * Updates the parsed links with the provided URL.
 * @param url - The URL to update.
 * @returns A promise that resolves when the operation is complete.
 */
async function updateParsedlLinks(url: string) {
  return await novelLinks.updateAsync(
    { _id: url },
    { parsed: true },
    {}
  );
}

// Uncomment the lines below if you want to test the functions or execute them

// await updateParsedLinks("https://www.novelupdates.com/novelslisting/?sort=2&order=1&status=1");
// getLastUrl()

export {
  updateParsedLinks,
  saveHtml,
  getLastUrl,
  updateLastUrl,
  saveNovelLinks,
  saveNovelMeta,
  getUnparsedData,
  updateParsedlLinks,
};
