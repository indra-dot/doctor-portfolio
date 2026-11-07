/**
 * Google Apps Script Web App Bridge for InternaHub CDSS
 * 
 * Serves the production InternaHub HTML directly from Google Drive.
 * 100% Google Cloud Environment (script.google.com), bypassing hospital Wi-Fi firewalls.
 * Allows embedding in Google Sites via "Sematkan -> Berdasarkan URL" with ALLOWALL x-frame options.
 */

function doGet(e) {
  try {
    var folderName = 'internahub-deploy';
    var fileName = 'internahub.html';
    var file = null;

    // 1. Cari di folder khusus internahub-deploy
    var folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      var folder = folders.next();
      var files = folder.getFilesByName(fileName);
      if (files.hasNext()) {
        file = files.next();
      }
    }

    // 2. Fallback pencarian file di seluruh Google Drive jika folder belum terdeteksi
    if (!file) {
      var allFiles = DriveApp.getFilesByName(fileName);
      if (allFiles.hasNext()) {
        file = allFiles.next();
      }
    }

    if (!file) {
      return HtmlService.createHtmlOutput(
        '<div style="font-family:sans-serif; padding:40px; text-align:center; color:#333;">' +
        '<h2>⚠️ File InternaHub Belum Tersinkronisasi</h2>' +
        '<p>Pastikan file <code>internahub.html</code> sudah ada di folder <code>internahub-deploy</code> pada Google Drive Anda.</p>' +
        '<p style="color:#666; font-size:13px;">Google Drive for Desktop akan otomatis mengunggah file ini saat build dijalankan.</p>' +
        '</div>'
      ).setTitle('InternaHub CDSS - Not Ready');
    }

    // 3. Baca konten HTML produksi yang disinkronkan oleh build-internahub.js
    var htmlContent = file.getBlob().getDataAsString();

    // 4. Return sebagai Web App yang mengizinkan iframe embedding di Google Sites
    return HtmlService.createHtmlOutput(htmlContent)
      .setTitle('InternaHub CDSS (dr. Guswib)')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');

  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif; padding:30px; color:#c00;">' +
      '<h3>Terjadi Kesalahan Server GAS:</h3>' +
      '<pre>' + err.toString() + '</pre>' +
      '</div>'
    ).setTitle('InternaHub Error');
  }
}
