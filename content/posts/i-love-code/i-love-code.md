---
title: I love Code
description: Some thoughts on the elegance of code.
date: 2021-01-06
---

I love code. Plain and simple.

I didn't always though. I started programming at 21 years old during my first masters---I was studying statistics and used code only as a means for running regression models and doing microeconometrics research. I started statistical programming back in 2011 using [STATA](https://www.stata.com/) and [SAS](https://www.sas.com/). They weren't *real* programming languages by a computer scientist's standards but that is technically how I started.

I eventually moved onto to learning [SQL](https://en.wikipedia.org/wiki/SQL) and [R](https://www.r-project.org/about.html) when I started working and I found myself often writing Monte Carlo simulations of harmonic regressions, two stage least-squares, and other machine learning/statistical phenomenon.

And that's how it started. I began learning [Python](https://www.python.org/) more actively at work and it mostly increased from there. During my second masters I started learning [Lua](http://www.lua.org/) in order to use [Torch](http://torch.ch/), which was used by [facebook AI](https://ai.facebook.com/) before [PyTorch](https://pytorch.org/) was developed. Then at Goldman I had to learn proprietary tools like Slang. Now I've spent the last year learning much more about [JavaScript](https://www.javascript.com/) and web development in general, and I just couldn't help but reflect and think about how much I actually *enjoy* it.

It's 2021 now and it's officially beeen a 10 year journey learning how to code (although what can only be argued as chaotically and poorly across different disciplines). Back when I first started I had no idea how anything in a computer worked and I was really, really bad at it. 

It was miserable and I always felt deeply insecure about my code. I feel lucky now that I'm no longer code-shy and I don't struggle as much as I used to. That's not to say I don't have typos or bugs (I do!) but it's more to say that it's much easier these days for me to read through and understand how things are working and how to debug.

But that took me 10 years and it was a literal headache for most of the time. I'm curious to see what I'll feel in 10 years and what else I'll have learned.

All that just to show this beautiful piece of code, which is *a* way to write a function which takes as input *n* and yields its [Fibonacci Number](https://en.wikipedia.org/wiki/Fibonacci_number).

```python
def f(n: int) -> int:
    assert n>0, 'n > 0'
    if n < 3:
        return {1:0, 2:1}[n]
    return f(n-1) + f(n-2)
```