const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Wib PC\\.gemini\\antigravity\\scratch\\doctor-portfolio\\rheumatools.html', 'utf8');
const match = content.match(/src="(data:image\/png;base64,[^"]+)"/);
if (match) {
  fs.writeFileSync('C:\\Users\\Wib PC\\.gemini\\antigravity\\scratch\\doctor-portfolio\\.agents\\worker_m3\\mrss_image_data.txt', match[1], 'utf8');
  console.log('Successfully extracted image data, length:', match[1].length);
} else {
  console.log('Could not find image match');
}
