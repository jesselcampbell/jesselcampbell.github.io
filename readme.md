# jesselcampbell.com
This is the personal website for Jesse Campbell, built using Jekyll and Gulp, with Siteleaf integrated for content management.

## Resources
- [Optimizing Jekyll Performance with Gulp](http://savaslabs.com/2016/10/19/optimizing-jekyll-with-gulp.html)
- [Vue.js Docs](https://vuejs.org)
- [Siteleaf Docs](https://learn.siteleaf.com)
- [Liquid Docs](https://shopify.github.io/liquid)

## Installation
1. Make sure [Bundler](http://bundler.io) and [Jekyll](http://jekyllrb.com/docs/installation/) are installed.
   * `gem install bundler`
   * `gem install jekyll`
2. Clone the repo
3. Run `bundle install`
4. Make sure [node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are installed. For npm, you should be running at least major version 3.
   * To update npm to the latest version, run `npm install npm@latest -g`
5. Install gulp globally.
   * `npm install -g gulp`
6. Make sure [ImageMagick](http://www.imagemagick.org/script/index.php) is installed.
   * `brew install imagemagick` should work on OSX
7. Run `npm install` to install node modules.

## Local Development

If you do not have Gulp installed locally then you can install it globally via `npm install -g gulp`. If needed, run `npm install` to install any modules that were added since you last served the site. To serve the site, run `gulp serve`. This uses the `_config.local.yml` for local development.

Thanks to `gulp.watch` and Browsersync, any changes you make will trigger Gulp to either regenerate the Jekyll site and automatically refresh your browser or, if they're changes to CSS or images, inject the updated file(s) so a refresh isn't needed.

You can toggle some options in `gulpfile.js`:

- In the `serve` task, change `ghostMode` to `true` if you want to mirror clicks, reloads, etc. across browsers. Useful for testing, hard on performance.
- In the `serve` task, change `open` to `false` if you don't want Browsersync to automatically open a browser window for you when you serve the site.
