Asking questions
================

You can ask questions by posting an issue. There is no problem, I'll just add the label `question`.

However, please follow those simple guidelines before posting:

1. Describe your issue in an understandable english (english is not my native language, but I still try to write something decent, and so should you).
2. Please be polite (and occasionally avoid being a beggar... :unamused:).
3. Provide a code to illustrate your issue. A [plnkr](http://plnkr.co/) or something alike is better.
4. Github provides us a wonderful [Markdown](https://help.github.com/articles/github-flavored-markdown) (text-to-HTML), so use it without restraint, especially when putting your code.
5. Some really good advices on how to ask question:
  * on [StackOverflow](http://stackoverflow.com/help/how-to-ask)
  * on [DataTables](https://datatables.net/manual/tech-notes/10)

Well, that's just some common sense, so it should not be so hard to follow them.

Thank you.

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
executing the following command and access to [http://localhost:3000](http://localhost:3000)
```
grunt serve
```
