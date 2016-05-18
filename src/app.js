const request = require('request')
const jsdom = require('jsdom')
const _ = require('lodash')

function getRawHtml (link) {
  return new Promise((resolve, reject) => {
    request(link, (err, res, body) => {
      if (err) {
        reject(err)
        return
      }
      resolve(body)
    })
  })
}

function createWindow (html) {
  return new Promise((resolve, reject) => {
      jsdom.env(html, (err, win) => {
      if (err) {
        reject(err)
        return
      }
      resolve(win)
    })
})
}

function findAllImageLinks (window) {
  return window.document.querySelectorAll('img')
}

if (!process.argv[2]) throw 'You must specify a web page to steal images from!'

const link = process.argv[2]

getRawHtml(link)
  .then(createWindow)
  .then(findAllImageLinks)
  .then(function (images) {
    _.each(images, img => console.log(img.src))
  })
  .catch(err => console.error(err))