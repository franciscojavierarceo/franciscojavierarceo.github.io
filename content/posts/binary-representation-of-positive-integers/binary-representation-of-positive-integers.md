---
title: Binary Representation of Positive Integers
description: A tutorial on converting numbers from decimal to binary...and back!
date: 2022-04-02
---

It's always fun to learn some additional tricks in math and computer science and I recently started reading about digital representation of numbers and [Swarthmore](https://www.swarthmore.edu/NatSci/echeeve1/Ref/BinaryMath/NumSys.html#:~:text=In%20summary%3A-,bit,numbers%20from%200%20to%20255.) has some truly great material on this. 

I was searching around the internet on how to progmatically convert decimal numbers to binary and I found there wasn't *that* great of a resource and stackoverflow had mixed stuff so I thought I'd put it something together quickly.

I'll probably add to this tutorial later but I think the code is the most important part.

# The basics

In short, we want to represent a decimal number (i.e., a number represented in base 10 via the 10 digits we use [0-9]), e.g., 86, as a binary number (i.e., a number represented in base 2 via the 2 digits we are then limited to [0 and 1]).

As outlined in the tutorial above, this results in the two representations:

$$86_{10} = 1*64 + 0*32 + 1*16 + 0*8 + 1*4 + 1*2 + 0*1$$

and 

$$86_{10} = 1*2^6 + 0*2^5 + 0*2^3 + 1*2^2 + 1*2^1 + 0*2^0$$

Which is equivalent to saying

$$86_{10} = 1010110_2.$$

The subscript $2$ denotes a binary number. Each digit in a binary number is called a bit. The number 1010110 is represented by 7 bits. Any number can be broken down this way, by finding all of the powers of 2 that add up to the number in question (in this case 26, 24, 22 and 21).

Cool.

So how do we do this with a computer?

# Binary Representation in Python

As we saw before, representing 86 in binary format requires us to deconstruct it from $2^n$, so with computers we can represent 86 by either recursively dividing by 2 (with some additional adjustment) or iteratively (via a while loop) doing pretty much the same thing. Here's the recursive version:

```python
def decimalToBinary(n: int) -> str:
    if n == 0:
        return ""
    else:
        return decimalToBinary(n // 2) + str(n % 2)
```

This is pretty simple and could be trivally mapped to a one-liner but for readability I'll say this is sufficient. Alternatively, we could solve this with a while loop using the following:

```python
def decimalToBinary2(n: int) -> str:
    bs = ''
    while n > 0:
        r = n / 2
        n = n // 2
        bs = str('1' if r % 1 > 0 else '0') + bs

    return bs
```

And this is also pretty simple. It's worth noting that the str() function call is required before concatenating the binary string variable (i.e., bs) because without it python will actually fail to execute the if-else logic and you will not get the behavior you are looking for.

# Decimal Representation from Binary in Python

Okay, so how do we confirm this is behaving correctly? Obviously we can just recover it.


```python
def binaryToDecimal(bs: str) -> int:
    n, r = len(bs), 0
    for i in range(n):
        r+= int(bs[i]) * 2**(n - i - 1)
    return r
```

And that's it! If you stare at this formula for a second you'll see it's just taking each bit in the string and multiplying the $i^{th}$ binary value by $2^{n-i-1}$.

We can verify that all of this works with some simple checks and comparisons: 

```python
decimalToBinary(86) == decimalToBinary2(86) # 1010110 == 1010110 --> true
binaryToDecimal(decimalToBinary2(86)) == 86 # true, converted 1010110 -> 86
```

How cool is that?  I'll note that this is only accurate for positive integers but for the general case you can use the first digit to represent the sign of the numbers (with some handling for the 0 edge case).

Hope you found this interesting. As I said I'll elaborate more on this post eventually but I thought I mostly wanted to share the code as I didn't really see good examples providing this back and forth and it was something that helped me understand things more concretely.

Happy typing!

-Francisco
