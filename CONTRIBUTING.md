Contributing
============

1. Fork this project and install the dependencies:
```
npm install
```
2. Create a new feature/patch branch or switch to the `dev` branch.
3. Code your feature/bug fix and live up to the current code standard:
  * Not violate [DRY](http://programmer.97things.oreilly.com/wiki/index.php/Don%27t_Repeat_Yourself)
  * [Boy scout rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule) should be applied
  * The code must be well documented
  * Add tests
4. Run `grunt` to build the minified files.
5. Write a nice [commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
6. [Pull request](https://help.github.com/articles/using-pull-requests) using the new feature/patch branch
7. Ensure the [Travis build](https://travis-ci.org/l-lin/angular-datatables) passes


If you need to see the result of your feature/bug fix on the demo, you can launch the node server by
executing the following command and access to [http://localhost:3000/angular-datatables](http://localhost:3000/angular-datatables)
```
grunt serve
```
