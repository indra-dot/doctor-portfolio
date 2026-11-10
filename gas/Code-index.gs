/**
 * Google Apps Script Web App Bridge for Doctor Portfolio (index.html)
 * 
 * Gunakan file ini jika Anda membuat project Google Apps Script terpisah khusus untuk
 * halaman utama portofolio (index.html).
 * 
 * Otomatis membaca file `index.html` dari folder `internahub-deploy` di Google Drive
 * yang disinkronkan otomatis setiap kali menjalankan `npm run build` atau `npm run build:index`.
 */

function doGet(e) {
  try {
    var folderName = 'internahub-deploy';
    var pageParam = (e && e.parameter && (e.parameter.page || e.parameter.file || '')).toLowerCase();

    var isInternahub = (pageParam === 'internahub' || pageParam === 'internahub.html');
    var fileName = isInternahub ? 'internahub.html' : 'index.html';
    var pageTitle = isInternahub
      ? 'InternaHub CDSS (dr. Guswib)'
      : 'Dr. Guswib — Clinical Software & Tools for Internal Medicine';

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
        '<h2>⚠️ File ' + fileName + ' Belum Tersinkronisasi</h2>' +
        '<p>Pastikan file <code>' + fileName + '</code> sudah ada di folder <code>' + folderName + '</code> pada Google Drive Anda.</p>' +
        '<p style="color:#666; font-size:13px;">Jalankan <code>npm run build</code> agar Google Drive for Desktop otomatis mengunggah file ini.</p>' +
        '</div>'
      ).setTitle(pageTitle + ' - Not Ready');
    }

    // 3. Baca konten HTML produksi yang disinkronkan oleh build-index.js
    var htmlContent = file.getBlob().getDataAsString();

    // 4. Return sebagai Web App yang mengizinkan iframe embedding di Google Sites
    return HtmlService.createHtmlOutput(htmlContent)
      .setTitle(pageTitle)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');

  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif; padding:30px; color:#c00;">' +
      '<h3>Terjadi Kesalahan Server GAS:</h3>' +
      '<pre>' + err.toString() + '</pre>' +
      '</div>'
    ).setTitle('Portfolio GAS Error');
  }
}
