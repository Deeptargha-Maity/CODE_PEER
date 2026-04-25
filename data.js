const defaultHints = {
  nudge: "Think about the problem constraints and what data structure might be best suited here.",
  clue: "Consider approaching this iteratively or recursively. Break the problem down into smaller steps.",
  answer: "# Solution depends on your chosen approach. Try to implement the logic discussed in the clues."
};

const defaultSocraticQuestions = [
  { trigger: 'for\\|while', question: "You're iterating! What invariants are you maintaining at each step of your loop?", line: null },
  { trigger: 'if', question: "Good, checking conditions. Have you considered all the edge cases?", line: null },
  { trigger: 'return', question: "Are you sure this is the correct output format? What about base cases?", line: null },
  { trigger: 'pass\\|TODO', question: "Where do you want to start? Think about the brute-force approach first.", line: null }
];

const PROBLEMS = {
  twoSum: {
    id: 'twoSum', title: 'Two Sum', difficulty: 'Medium',
    tags: ['Array', 'Hash Map', 'Searching'],
    description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return the <strong>indices</strong> of the two numbers that add up to target.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', note: 'nums[0]+nums[1] = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    starterCode: {
      python: `def two_sum(nums, target):\n    # Your solution here\n    pass\n\nprint(two_sum([2,7,11,15], 9))`,
      javascript: `function twoSum(nums, target) {\n    // Your solution here\n}\n\nconsole.log(twoSum([2,7,11,15], 9));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2,7,11,15};\n    auto r = twoSum(nums, 9);\n    cout << "[" << r[0] << "," << r[1] << "]\\n";\n}`
    },
    hints: {
      nudge: "What if you could remember numbers you've already seen? What data structure is great at quick lookups?",
      clue: "For each number `x`, you need `target - x`. A hash map lets you check if that complement exists in O(1).\n\nPseudocode:\n  map = {}\n  for i, x in nums:\n    if (target-x) in map → return [map[target-x], i]\n    map[x] = i",
      answer: `# Python O(n) solution:\ndef two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        comp = target - x\n        if comp in seen:\n            return [seen[comp], i]\n        seen[x] = i`
    },
    socraticQuestions: [
      { trigger: 'loop', question: "You're iterating — good! For each element, what are you trying to *find*? What's the relationship between the current number and your target?", line: null },
      { trigger: 'nested', question: "Two nested loops give O(n²). Can you solve this in a single pass? What would you need to *remember* as you go?", line: null },
      { trigger: 'dict\|map\|hash\|{}', question: "Great choice of data structure! What exactly are you storing as the key vs. the value, and why?", line: null },
      { trigger: 'return', question: "What edge cases haven't you handled yet? What if no solution exists, or if the same element is used twice?", line: null },
      { trigger: 'pass\|TODO\|placeholder', question: "Where do you want to start? Think about the brute-force approach first — what would you check for every pair of numbers?", line: null }
    ],
    refactor: "Your solution works! Now can you reduce it from O(n) space to see if it's possible with less memory? Or: what if the array was sorted — could you use two pointers instead?",
    testCases: [
      { call: 'return twoSum([2,7,11,15], 9);', expected: [0,1], label: 'twoSum([2,7,11,15], 9)' },
      { call: 'return twoSum([3,2,4], 6);', expected: [1,2], label: 'twoSum([3,2,4], 6)' },
      { call: 'return twoSum([3,3], 6);', expected: [0,1], label: 'twoSum([3,3], 6)' }
    ]
  },
  fibonacci: {
    id: 'fibonacci', title: 'Fibonacci (Optimized)', difficulty: 'Easy',
    tags: ['Recursion', 'Dynamic Programming', 'Memoization'],
    description: `Return the <strong>nth Fibonacci number</strong>. F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2).`,
    examples: [
      { input: 'n = 6', output: '8' },
      { input: 'n = 10', output: '55' }
    ],
    starterCode: {
      python: `def fib(n):\n    # Your solution here\n    pass\n\nprint(fib(10))`,
      javascript: `function fib(n) {\n    // Your solution here\n}\n\nconsole.log(fib(10));`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    // Your solution here\n    return 0;\n}\n\nint main() { cout << fib(10) << endl; }`
    },
    hints: {
      nudge: "Recursion is natural here — but watch out for repeated work. How many times does fib(3) get computed in fib(10)?",
      clue: "Memoization stores results so you don't recompute them.\n\nPseudocode:\n  memo = {0:0, 1:1}\n  def fib(n):\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1)+fib(n-2)\n    return memo[n]",
      answer: `def fib(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]`
    },
    socraticQuestions: [
      { trigger: 'def fib\|function fib\|int fib', question: "Good start! What's your base case? Without it, what happens when your recursion bottoms out?", line: null },
      { trigger: 'return fib', question: "This is recursive — nice. If you call fib(40), how many total function calls happen? Is that efficient?", line: null },
      { trigger: 'memo\|cache\|dict\|{}', question: "You're thinking about memoization! What's the key and value you're storing, and how does that prevent redundant work?", line: null },
      { trigger: 'for\|while', question: "Iterative approach — clever! What two variables do you need to track at each step?", line: null }
    ],
    refactor: "Your recursive solution works! Can you convert it to an iterative O(1) space solution using only two variables?",
    testCases: [
      { call: 'return fib(0);', expected: 0, label: 'fib(0)' },
      { call: 'return fib(1);', expected: 1, label: 'fib(1)' },
      { call: 'return fib(6);', expected: 8, label: 'fib(6)' },
      { call: 'return fib(10);', expected: 55, label: 'fib(10)' }
    ]
  },
  palindrome: {
    id: 'palindrome', title: 'Valid Palindrome', difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    description: `A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Return <strong>true</strong> if it is a palindrome.`,
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true' },
      { input: '"race a car"', output: 'false' }
    ],
    starterCode: {
      python: `def is_palindrome(s):\n    # Your solution here\n    pass\n\nprint(is_palindrome("A man, a plan, a canal: Panama"))`,
      javascript: `function isPalindrome(s) {\n    // Your solution here\n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    return false;\n}\n\nint main() { cout << isPalindrome("A man, a plan, a canal: Panama") << endl; }`
    },
    hints: {
      nudge: "Before checking if it reads the same both ways, what do you need to *clean* from the string first?",
      clue: "Two approaches:\n1. Clean string → compare with reverse\n2. Two pointers (left, right) → skip non-alphanumeric → compare chars\n\nTwo-pointer is O(1) space.",
      answer: `def is_palindrome(s):\n    l, r = 0, len(s)-1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l += 1; r -= 1\n    return True`
    },
    socraticQuestions: [
      { trigger: 'reverse\|[::-1]', question: "Reversing works! But what's the time/space complexity? Can you do it without creating a reversed copy?", line: null },
      { trigger: 'lower\|upper', question: "Good — you're handling case! But what about special characters and spaces? How will you filter those?", line: null },
      { trigger: 'isalnum\|replace\|re\\.', question: "You're cleaning the string — great. Now think: do you need to store the cleaned version, or can you check on-the-fly?", line: null },
      { trigger: 'while\|for', question: "Iterating! If you use two pointers (left and right), what conditions let you skip non-alphanumeric characters?", line: null }
    ],
    refactor: "Excellent! You solved it. Now: can you solve it in O(1) extra space using two pointers, without creating any new strings?",
    testCases: [
      { call: 'return isPalindrome("A man, a plan, a canal: Panama");', expected: true, label: 'isPalindrome("A man...")' },
      { call: 'return isPalindrome("race a car");', expected: false, label: 'isPalindrome("race a car")' },
      { call: 'return isPalindrome(" ");', expected: true, label: 'isPalindrome(" ")' }
    ]
  },

  // ── Basics ──
  patterns: {
    id: 'patterns', title: 'Star Pattern', difficulty: 'Easy', tags: ['Loops'],
    description: 'Print an N x N square star pattern.', examples: [{input: 'N = 3', output: '***\\n***\\n***'}],
    starterCode: {
      python: `def print_pattern(n):\n    pass\n\nprint_pattern(3)`,
      javascript: `function printPattern(n) {\n}\nprintPattern(3);`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid printPattern(int n) {}\nint main() { printPattern(3); }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do this with a single loop?"
  },
  basicMath: {
    id: 'basicMath', title: 'Count Digits', difficulty: 'Easy', tags: ['Math'],
    description: 'Count digits of a number N that evenly divide N.', examples: [{input: 'N = 12', output: '2'}],
    starterCode: {
      python: `def count_digits(n):\n    pass\n\nprint(count_digits(12))`,
      javascript: `function countDigits(n) {\n}\nconsole.log(countDigits(12));`,
      cpp: `#include <iostream>\nusing namespace std;\nint countDigits(int n) { return 0; }\nint main() { cout << countDigits(12); }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Handle the case where a digit is 0."
  },
  recursionBasics: {
    id: 'recursionBasics', title: 'Print 1 to N', difficulty: 'Easy', tags: ['Recursion'],
    description: 'Print 1 to N using recursion without loops.', examples: [{input: 'N = 5', output: '1 2 3 4 5'}],
    starterCode: {
      python: `def print_1_to_n(n):\n    pass\n\nprint_1_to_n(5)`,
      javascript: `function print1ToN(n) {\n}\nprint1ToN(5);`,
      cpp: `#include <iostream>\nusing namespace std;\nvoid print1ToN(int n) {}\nint main() { print1ToN(5); }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "What is the space complexity due to the call stack?"
  },

  // ── Arrays ──
  largestElement: {
    id: 'largestElement', title: 'Largest Element', difficulty: 'Easy', tags: ['Array'],
    description: 'Find the largest element in an array.', examples: [{input: '[1,8,7,56,90]', output: '90'}],
    starterCode: {
      python: `def find_largest(arr):\n    pass\n\nprint(find_largest([1,8,7,56,90]))`,
      javascript: `function findLargest(arr) {\n}\nconsole.log(findLargest([1,8,7,56,90]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint findLargest(vector<int>& a) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you find it in exactly one pass?",
    testCases: [
      { call: 'return findLargest([1,8,7,56,90]);', expected: 90, label: 'findLargest([1,8,7,56,90])' },
      { call: 'return findLargest([-1,-8,-7]);', expected: -1, label: 'findLargest([-1,-8,-7])' },
      { call: 'return findLargest([5]);', expected: 5, label: 'findLargest([5])' }
    ]
  },
  secondLargest: {
    id: 'secondLargest', title: 'Second Largest', difficulty: 'Easy', tags: ['Array'],
    description: 'Find the second largest unique element.', examples: [{input: '[1,2,4,7,7,5]', output: '5'}],
    starterCode: {
      python: `def second_largest(arr):\n    pass\n\nprint(second_largest([1,2,4,7,7,5]))`,
      javascript: `function secondLargest(arr) {\n}\nconsole.log(secondLargest([1,2,4,7,7,5]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint secondLargest(vector<int>& a) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do this in one pass without sorting?",
    testCases: [
      { call: 'return secondLargest([1,2,4,7,7,5]);', expected: 5, label: 'secondLargest([1,2,4,7,7,5])' },
      { call: 'return secondLargest([10,10,10]);', expected: -1, label: 'secondLargest([10,10,10]) edge' }
    ]
  },
  moveZeros: {
    id: 'moveZeros', title: 'Move Zeros', difficulty: 'Easy', tags: ['Array', 'Two Pointers'],
    description: 'Move all 0s to the end while maintaining relative order of non-zero elements.', examples: [{input: '[0,1,0,3,12]', output: '[1,3,12,0,0]'}],
    starterCode: {
      python: `def move_zeros(nums):\n    pass\n\na=[0,1,0,3,12]; move_zeros(a); print(a)`,
      javascript: `function moveZeros(nums) {\n}\nlet a=[0,1,0,3,12]; moveZeros(a); console.log(a);`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid moveZeros(vector<int>& nums) {}\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you minimize the total number of operations?"
  },
  kadanes: {
    id: 'kadanes', title: 'Maximum Subarray Sum', difficulty: 'Medium', tags: ['Array', 'DP'],
    description: 'Find the contiguous subarray with the largest sum.', examples: [{input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6'}],
    starterCode: {
      python: `def max_sub_array(nums):\n    pass\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))`,
      javascript: `function maxSubArray(nums) {\n}\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint maxSubArray(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "At each position, should you extend the current subarray or start fresh?",
      clue: "Track currentSum. If it drops below 0, reset to 0. Update maxSum = max(maxSum, currentSum) at each step.",
      answer: `def max_sub_array(nums):\n    max_sum = cur = nums[0]\n    for n in nums[1:]:\n        cur = max(n, cur + n)\n        max_sum = max(max_sum, cur)\n    return max_sum`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Can you also return the start and end indices of the subarray?",
    testCases: [
      { call: 'return maxSubArray([-2,1,-3,4,-1,2,1,-5,4]);', expected: 6, label: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])' },
      { call: 'return maxSubArray([-1]);', expected: -1, label: 'maxSubArray([-1])' },
      { call: 'return maxSubArray([5,4,-1,7,8]);', expected: 23, label: 'maxSubArray([5,4,-1,7,8])' }
    ]
  },
  maxProductSubarray: {
    id: 'maxProductSubarray', title: 'Max Product Subarray', difficulty: 'Medium', tags: ['Array', 'DP'],
    description: 'Find the contiguous subarray with the largest product.', examples: [{input: '[2,3,-2,4]', output: '6'}],
    starterCode: {
      python: `def max_product(nums):\n    pass\n\nprint(max_product([2,3,-2,4]))`,
      javascript: `function maxProduct(nums) {\n}\nconsole.log(maxProduct([2,3,-2,4]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint maxProduct(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "Unlike sum, negative * negative = positive. Track both max AND min at each step.",
      clue: "When you hit a negative number, the max and min swap roles. Track curMax, curMin, and result.",
      answer: `def max_product(nums):\n    res = curMax = curMin = nums[0]\n    for n in nums[1:]:\n        curMax, curMin = max(n, curMax*n, curMin*n), min(n, curMax*n, curMin*n)\n        res = max(res, curMax)\n    return res`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Handle the edge case where all numbers are negative.",
    testCases: [
      { call: 'return maxProduct([2,3,-2,4]);', expected: 6, label: 'maxProduct([2,3,-2,4])' },
      { call: 'return maxProduct([-2,0,-1]);', expected: 0, label: 'maxProduct([-2,0,-1])' },
      { call: 'return maxProduct([-2,3,-4]);', expected: 24, label: 'maxProduct([-2,3,-4])' }
    ]
  },

  // ── Sorting ──
  selectionSort: {
    id: 'selectionSort', title: 'Selection Sort', difficulty: 'Easy', tags: ['Sorting'],
    description: 'Sort an array using Selection Sort.', examples: [{input: '[5,2,3,1]', output: '[1,2,3,5]'}],
    starterCode: {
      python: `def selection_sort(arr):\n    pass\n\na=[5,2,3,1]; selection_sort(a); print(a)`,
      javascript: `function selectionSort(arr) {\n}\nlet a=[5,2,3,1]; selectionSort(a); console.log(a);`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid selectionSort(vector<int>& arr) {}\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "What is the time complexity? Is it ever better than O(n²)?"
  },
  bubbleSort: {
    id: 'bubbleSort', title: 'Bubble Sort', difficulty: 'Easy', tags: ['Sorting'],
    description: 'Sort an array using Bubble Sort.', examples: [{input: '[5,2,3,1]', output: '[1,2,3,5]'}],
    starterCode: {
      python: `def bubble_sort(arr):\n    pass\n\na=[5,2,3,1]; bubble_sort(a); print(a)`,
      javascript: `function bubbleSort(arr) {\n}\nlet a=[5,2,3,1]; bubbleSort(a); console.log(a);`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid bubbleSort(vector<int>& arr) {}\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Add early termination if array is already sorted."
  },
  insertionSort: {
    id: 'insertionSort', title: 'Insertion Sort', difficulty: 'Easy', tags: ['Sorting'],
    description: 'Sort an array using Insertion Sort.', examples: [{input: '[5,2,3,1]', output: '[1,2,3,5]'}],
    starterCode: {
      python: `def insertion_sort(arr):\n    pass\n\na=[5,2,3,1]; insertion_sort(a); print(a)`,
      javascript: `function insertionSort(arr) {\n}\nlet a=[5,2,3,1]; insertionSort(a); console.log(a);`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid insertionSort(vector<int>& arr) {}\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Why is insertion sort preferred for nearly-sorted data?"
  },
  mergeSort: {
    id: 'mergeSort', title: 'Merge Sort', difficulty: 'Medium', tags: ['Sorting', 'Divide and Conquer'],
    description: 'Sort an array using Merge Sort.', examples: [{input: '[5,2,3,1]', output: '[1,2,3,5]'}],
    starterCode: {
      python: `def merge_sort(arr):\n    pass\n\na=[5,2,3,1]; merge_sort(a); print(a)`,
      javascript: `function mergeSort(arr) {\n}\nlet a=[5,2,3,1]; mergeSort(a); console.log(a);`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid mergeSort(vector<int>& arr) {}\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "What is the space complexity? Can you do it in-place?"
  },
  quickSort: {
    id: 'quickSort', title: 'Quick Sort', difficulty: 'Medium', tags: ['Sorting', 'Divide and Conquer'],
    description: 'Sort an array using Quick Sort.', examples: [{input: '[5,2,3,1]', output: '[1,2,3,5]'}],
    starterCode: {
      python: `def quick_sort(arr):\n    pass\n\na=[5,2,3,1]; quick_sort(a); print(a)`,
      javascript: `function quickSort(arr) {\n}\nlet a=[5,2,3,1]; quickSort(a); console.log(a);`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvoid quickSort(vector<int>& arr) {}\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use randomized pivot to avoid worst-case O(n²)."
  },

  // ── Binary Search ──
  binarySearch: {
    id: 'binarySearch', title: 'Binary Search', difficulty: 'Easy', tags: ['Binary Search'],
    description: 'Find target in a sorted array. Return index or -1.', examples: [{input: 'nums=[-1,0,3,5,9,12], target=9', output: '4'}],
    starterCode: {
      python: `def binary_search(nums, target):\n    pass\n\nprint(binary_search([-1,0,3,5,9,12], 9))`,
      javascript: `function binarySearch(nums, target) {\n}\nconsole.log(binarySearch([-1,0,3,5,9,12], 9));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint binarySearch(vector<int>& nums, int target) { return -1; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Are you preventing integer overflow when calculating mid?",
    testCases: [
      { call: 'return binarySearch([-1,0,3,5,9,12], 9);', expected: 4, label: 'binarySearch(..., 9)' },
      { call: 'return binarySearch([-1,0,3,5,9,12], 2);', expected: -1, label: 'binarySearch(..., 2) not found' },
      { call: 'return binarySearch([5], 5);', expected: 0, label: 'binarySearch([5], 5)' }
    ]
  },
  searchRotated: {
    id: 'searchRotated', title: 'Search Rotated Array', difficulty: 'Medium', tags: ['Binary Search'],
    description: 'Find target in an array that has been rotated.', examples: [{input: 'nums=[4,5,6,7,0,1,2], target=0', output: '4'}],
    starterCode: {
      python: `def search_rotated(nums, target):\n    pass\n\nprint(search_rotated([4,5,6,7,0,1,2], 0))`,
      javascript: `function searchRotated(nums, target) {\n}\nconsole.log(searchRotated([4,5,6,7,0,1,2], 0));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint searchRotated(vector<int>& nums, int target) { return -1; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do this in one pass instead of finding the pivot first?",
    testCases: [
      { call: 'return searchRotated([4,5,6,7,0,1,2], 0);', expected: 4, label: 'searchRotated(..., 0)' },
      { call: 'return searchRotated([4,5,6,7,0,1,2], 3);', expected: -1, label: 'searchRotated(..., 3) not found' },
      { call: 'return searchRotated([1], 0);', expected: -1, label: 'searchRotated([1], 0)' }
    ]
  },
  peakElement: {
    id: 'peakElement', title: 'Peak Element', difficulty: 'Medium', tags: ['Binary Search'],
    description: 'Find a peak element (strictly greater than neighbors).', examples: [{input: '[1,2,3,1]', output: '2'}],
    starterCode: {
      python: `def find_peak(nums):\n    pass\n\nprint(find_peak([1,2,3,1]))`,
      javascript: `function findPeak(nums) {\n}\nconsole.log(findPeak([1,2,3,1]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint findPeak(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Is your solution O(log N)?"
  },

  // ── Strings ──
  anagram: {
    id: 'anagram', title: 'Anagram Check', difficulty: 'Easy', tags: ['String', 'Hash Map'],
    description: 'Check if two strings are anagrams of each other.', examples: [{input: 's="anagram", t="nagaram"', output: 'true'}],
    starterCode: {
      python: `def is_anagram(s, t):\n    pass\n\nprint(is_anagram("anagram", "nagaram"))`,
      javascript: `function isAnagram(s, t) {\n}\nconsole.log(isAnagram("anagram", "nagaram"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nbool isAnagram(string s, string t) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do it with a single frequency array?",
    testCases: [
      { call: 'return isAnagram("anagram", "nagaram");', expected: true, label: 'isAnagram("anagram","nagaram")' },
      { call: 'return isAnagram("rat", "car");', expected: false, label: 'isAnagram("rat","car")' },
      { call: 'return isAnagram("", "");', expected: true, label: 'isAnagram("","")' }
    ]
  },
  longestSubstring: {
    id: 'longestSubstring', title: 'Longest Substring Without Repeating', difficulty: 'Medium', tags: ['String', 'Sliding Window'],
    description: 'Find the length of the longest substring without repeating characters.', examples: [{input: '"abcabcbb"', output: '3'}],
    starterCode: {
      python: `def length_of_longest(s):\n    pass\n\nprint(length_of_longest("abcabcbb"))`,
      javascript: `function lengthOfLongest(s) {\n}\nconsole.log(lengthOfLongest("abcabcbb"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint lengthOfLongest(string s) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "Use a sliding window. When do you expand vs shrink?",
      clue: "Use a set to track chars in the window. If duplicate found, shrink from the left until the duplicate is removed.",
      answer: `def length_of_longest(s):\n    seen = set(); l = res = 0\n    for r, c in enumerate(s):\n        while c in seen: seen.remove(s[l]); l += 1\n        seen.add(c); res = max(res, r-l+1)\n    return res`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Can you solve it in exactly O(N) time?",
    testCases: [
      { call: 'return lengthOfLongest("abcabcbb");', expected: 3, label: 'lengthOfLongest("abcabcbb")' },
      { call: 'return lengthOfLongest("bbbbb");', expected: 1, label: 'lengthOfLongest("bbbbb")' },
      { call: 'return lengthOfLongest("pwwkew");', expected: 3, label: 'lengthOfLongest("pwwkew")' }
    ]
  },
  longestPalindromicSubstring: {
    id: 'longestPalindromicSubstring', title: 'Longest Palindromic Substring', difficulty: 'Medium', tags: ['String', 'DP'],
    description: 'Return the longest palindromic substring.', examples: [{input: '"babad"', output: '"bab"'}],
    starterCode: {
      python: `def longest_palindrome(s):\n    pass\n\nprint(longest_palindrome("babad"))`,
      javascript: `function longestPalindrome(s) {\n}\nconsole.log(longestPalindrome("babad"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nstring longestPalindrome(string s) { return ""; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Try expand-around-center for O(n²) time O(1) space."
  },
  groupAnagrams: {
    id: 'groupAnagrams', title: 'Group Anagrams', difficulty: 'Medium', tags: ['String', 'Hash Map', 'Sorting'],
    description: 'Group strings that are anagrams of each other.', examples: [{input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]'}],
    starterCode: {
      python: `def group_anagrams(strs):\n    pass\n\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))`,
      javascript: `function groupAnagrams(strs) {\n}\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nvector<vector<string>> groupAnagrams(vector<string>& strs) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use char-count tuple as key instead of sorting for O(n·k)."
  },

  // ── Linked List ──
  reverseList: {
    id: 'reverseList', title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List'],
    description: 'Reverse a singly linked list.', examples: [{input: '[1,2,3,4,5]', output: '[5,4,3,2,1]'}],
    starterCode: {
      python: `def reverse_list(head):\n    pass`,
      javascript: `function reverseList(head) {\n}`,
      cpp: `ListNode* reverseList(ListNode* head) { return nullptr; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Implement both iterative and recursive solutions."
  },
  detectCycle: {
    id: 'detectCycle', title: 'Detect Cycle', difficulty: 'Easy', tags: ['Linked List', 'Two Pointers'],
    description: 'Determine if a linked list has a cycle.', examples: [{input: 'head = [3,2,0,-4], pos = 1', output: 'true'}],
    starterCode: {
      python: `def has_cycle(head):\n    pass`,
      javascript: `function hasCycle(head) {\n}`,
      cpp: `bool hasCycle(ListNode *head) { return false; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use Floyd's Tortoise and Hare for O(1) memory."
  },
  mergeLists: {
    id: 'mergeLists', title: 'Merge Two Sorted Lists', difficulty: 'Easy', tags: ['Linked List'],
    description: 'Merge two sorted linked lists.', examples: [{input: 'l1=[1,2,4], l2=[1,3,4]', output: '[1,1,2,3,4,4]'}],
    starterCode: {
      python: `def merge_two_lists(l1, l2):\n    pass`,
      javascript: `function mergeTwoLists(l1, l2) {\n}`,
      cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) { return nullptr; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do it in-place without creating new nodes?"
  },
  removeNthFromEnd: {
    id: 'removeNthFromEnd', title: 'Remove Nth From End', difficulty: 'Medium', tags: ['Linked List', 'Two Pointers'],
    description: 'Remove the nth node from the end of a linked list.', examples: [{input: 'head=[1,2,3,4,5], n=2', output: '[1,2,3,5]'}],
    starterCode: {
      python: `def remove_nth_from_end(head, n):\n    pass`,
      javascript: `function removeNthFromEnd(head, n) {\n}`,
      cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) { return nullptr; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do it in one pass using two pointers?"
  },

  // ── Stack & Queue ──
  validParentheses: {
    id: 'validParentheses', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['Stack'],
    description: 'Determine if the input string has valid parentheses.', examples: [{input: '"()[]{}"', output: 'true'}],
    starterCode: {
      python: `def is_valid(s):\n    pass\n\nprint(is_valid("()[]{}"))`,
      javascript: `function isValid(s) {\n}\nconsole.log(isValid("()[]{}"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nbool isValid(string s) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "",
    testCases: [
      { call: 'return isValid("()[]{}");', expected: true, label: 'isValid("()[]{}")' },
      { call: 'return isValid("(]");', expected: false, label: 'isValid("(]")' },
      { call: 'return isValid("([)]");', expected: false, label: 'isValid("([)]")' },
      { call: 'return isValid("{[]}");', expected: true, label: 'isValid("{[]}")' }
    ]
  },
  nextGreater: {
    id: 'nextGreater', title: 'Next Greater Element', difficulty: 'Medium', tags: ['Stack'],
    description: 'Find the next greater element for every element.', examples: [{input: '[4,1,2]', output: '[-1,2,-1]'}],
    starterCode: {
      python: `def next_greater(nums):\n    pass\n\nprint(next_greater([4,1,2]))`,
      javascript: `function nextGreater(nums) {\n}\nconsole.log(nextGreater([4,1,2]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> nextGreater(vector<int>& nums) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use a monotonic stack for O(N) time."
  },
  minStack: {
    id: 'minStack', title: 'Min Stack', difficulty: 'Medium', tags: ['Stack', 'Design'],
    description: 'Design a stack that supports push, pop, top, and getMin in O(1) time.', examples: [{input: 'push(-2), push(0), push(-3), getMin()', output: '-3'}],
    starterCode: {
      python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val): pass\n    def pop(self): pass\n    def top(self): pass\n    def getMin(self): pass`,
      javascript: `class MinStack {\n    constructor() {}\n    push(val) {}\n    pop() {}\n    top() {}\n    getMin() {}\n}`,
      cpp: `class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use a single stack storing pairs of (value, currentMin)."
  },

  // ── Trees ──
  treeTraversal: {
    id: 'treeTraversal', title: 'Tree Traversal', difficulty: 'Easy', tags: ['Tree', 'DFS'],
    description: 'Return the inorder traversal of a binary tree.', examples: [{input: 'root = [1,null,2,3]', output: '[1,3,2]'}],
    starterCode: {
      python: `def inorder(root):\n    pass`,
      javascript: `function inorder(root) {\n}`,
      cpp: `vector<int> inorder(TreeNode* root) { return {}; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do inorder traversal iteratively?"
  },
  treeHeight: {
    id: 'treeHeight', title: 'Height of Tree', difficulty: 'Easy', tags: ['Tree', 'DFS'],
    description: 'Find the maximum depth of a binary tree.', examples: [{input: 'root = [3,9,20,null,null,15,7]', output: '3'}],
    starterCode: {
      python: `def max_depth(root):\n    pass`,
      javascript: `function maxDepth(root) {\n}`,
      cpp: `int maxDepth(TreeNode* root) { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: ""
  },
  treeDiameter: {
    id: 'treeDiameter', title: 'Diameter of Tree', difficulty: 'Medium', tags: ['Tree', 'DFS'],
    description: 'Find the length of the diameter of a binary tree.', examples: [{input: 'root = [1,2,3,4,5]', output: '3'}],
    starterCode: {
      python: `def diameter(root):\n    pass`,
      javascript: `function diameter(root) {\n}`,
      cpp: `int diameter(TreeNode* root) { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Calculate diameter while calculating height in one pass."
  },
  invertBinaryTree: {
    id: 'invertBinaryTree', title: 'Invert Binary Tree', difficulty: 'Easy', tags: ['Tree', 'DFS'],
    description: 'Invert a binary tree (mirror it).', examples: [{input: '[4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]'}],
    starterCode: {
      python: `def invert_tree(root):\n    pass`,
      javascript: `function invertTree(root) {\n}`,
      cpp: `TreeNode* invertTree(TreeNode* root) { return nullptr; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you solve this iteratively using BFS?"
  },
  validateBST: {
    id: 'validateBST', title: 'Validate BST', difficulty: 'Medium', tags: ['Tree', 'DFS'],
    description: 'Determine if a binary tree is a valid Binary Search Tree.', examples: [{input: 'root = [2,1,3]', output: 'true'}],
    starterCode: {
      python: `def is_valid_BST(root):\n    pass`,
      javascript: `function isValidBST(root) {\n}`,
      cpp: `bool isValidBST(TreeNode* root) { return false; }`
    },
    hints: {
      nudge: "Checking only direct children isn't enough. How do you propagate min/max bounds down the tree?",
      clue: "Pass bounds: validate(node, min=-inf, max=+inf). node.val must be in (min, max). Recurse left with max=node.val, right with min=node.val.",
      answer: `def is_valid_BST(root, lo=float('-inf'), hi=float('inf')):\n    if not root: return True\n    if not (lo < root.val < hi): return False\n    return is_valid_BST(root.left, lo, root.val) and is_valid_BST(root.right, root.val, hi)`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Can you solve this using inorder traversal?"
  },
  levelOrderTraversal: {
    id: 'levelOrderTraversal', title: 'Level Order Traversal', difficulty: 'Medium', tags: ['Tree', 'BFS'],
    description: 'Return the level order traversal of a binary tree (left to right, level by level).', examples: [{input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]'}],
    starterCode: {
      python: `from collections import deque\ndef level_order(root):\n    pass`,
      javascript: `function levelOrder(root) {\n}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) { return {}; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you do this using DFS with a depth parameter?"
  },

  // ── Graphs ──
  bfsDfs: {
    id: 'bfsDfs', title: 'BFS & DFS', difficulty: 'Medium', tags: ['Graph', 'BFS', 'DFS'],
    description: 'Traverse a graph using BFS and DFS.', examples: [{input: 'V=5, E=[[0,1],[0,2],[1,3]]', output: 'BFS: [0,1,2,3]'}],
    starterCode: {
      python: `def bfs(adj):\n    pass`,
      javascript: `function bfs(adj) {\n}`,
      cpp: `vector<int> bfs(vector<vector<int>>& adj) { return {}; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: ""
  },
  detectCycleGraph: {
    id: 'detectCycleGraph', title: 'Cycle Detection in Graph', difficulty: 'Medium', tags: ['Graph', 'DFS'],
    description: 'Detect a cycle in an undirected graph.', examples: [{input: 'V=3, E=[[0,1],[1,2],[2,0]]', output: 'true'}],
    starterCode: {
      python: `def is_cyclic(adj):\n    pass`,
      javascript: `function isCyclic(adj) {\n}`,
      cpp: `bool isCyclic(vector<vector<int>>& adj) { return false; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you detect a cycle in a directed graph too?"
  },
  topologicalSort: {
    id: 'topologicalSort', title: 'Topological Sort', difficulty: 'Medium', tags: ['Graph', 'BFS'],
    description: 'Find the linear ordering of vertices in a DAG.', examples: [{input: 'V=4, E=[[1,0],[2,0],[3,1],[3,2]]', output: '[3,1,2,0]'}],
    starterCode: {
      python: `def topo_sort(adj):\n    pass`,
      javascript: `function topoSort(adj) {\n}`,
      cpp: `vector<int> topoSort(vector<vector<int>>& adj) { return {}; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: ""
  },
  numberOfIslands: {
    id: 'numberOfIslands', title: 'Number of Islands', difficulty: 'Medium', tags: ['Graph', 'DFS', 'BFS'],
    description: 'Given an m×n grid of 1s (land) and 0s (water), count the number of islands.', examples: [{input: '[["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2'}],
    starterCode: {
      python: `def num_islands(grid):\n    pass\n\ngrid = [["1","1","0"],["1","1","0"],["0","0","1"]]\nprint(num_islands(grid))`,
      javascript: `function numIslands(grid) {\n}\nconsole.log(numIslands([["1","1","0"],["1","1","0"],["0","0","1"]]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint numIslands(vector<vector<char>>& grid) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "Every time you find an unvisited '1', that's a new island. How do you mark all connected land as visited?",
      clue: "DFS/BFS from every unvisited '1'. Mark cells as '0' when visited. Count how many times you start a new DFS.",
      answer: `def num_islands(grid):\n    count = 0\n    def dfs(r, c):\n        if r<0 or r>=len(grid) or c<0 or c>=len(grid[0]) or grid[r][c]=='0': return\n        grid[r][c] = '0'\n        for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]: dfs(r+dr, c+dc)\n    for r in range(len(grid)):\n        for c in range(len(grid[0])):\n            if grid[r][c] == '1': count += 1; dfs(r, c)\n    return count`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Can you solve this with Union-Find?"
  },

  // ── Dynamic Programming ──
  climbingStairs: {
    id: 'climbingStairs', title: 'Climbing Stairs', difficulty: 'Easy', tags: ['DP', 'Math'],
    description: 'You can climb 1 or 2 steps. In how many distinct ways can you climb n steps?', examples: [{input: 'n = 3', output: '3'}],
    starterCode: {
      python: `def climb_stairs(n):\n    pass\n\nprint(climb_stairs(5))`,
      javascript: `function climbStairs(n) {\n}\nconsole.log(climbStairs(5));`,
      cpp: `#include <iostream>\nusing namespace std;\nint climbStairs(int n) { return 0; }\nint main() { cout << climbStairs(5); }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Do it in O(1) space with two variables.",
    testCases: [
      { call: 'return climbStairs(2);', expected: 2, label: 'climbStairs(2)' },
      { call: 'return climbStairs(3);', expected: 3, label: 'climbStairs(3)' },
      { call: 'return climbStairs(5);', expected: 8, label: 'climbStairs(5)' }
    ]
  },
  knapsack: {
    id: 'knapsack', title: '0/1 Knapsack', difficulty: 'Medium', tags: ['DP'],
    description: 'Given weights and values of N items, find max value in a knapsack of capacity W.', examples: [{input: 'W=50, wt=[10,20,30], val=[60,100,120]', output: '220'}],
    starterCode: {
      python: `def knapsack(W, wt, val, n):\n    pass\n\nprint(knapsack(50, [10,20,30], [60,100,120], 3))`,
      javascript: `function knapsack(W, wt, val, n) {\n}\nconsole.log(knapsack(50, [10,20,30], [60,100,120], 3));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint knapsack(int W, vector<int>& wt, vector<int>& val, int n) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Optimize space to O(W) with a 1D array."
  },
  lcs: {
    id: 'lcs', title: 'Longest Common Subsequence', difficulty: 'Medium', tags: ['DP', 'String'],
    description: 'Find the length of the longest common subsequence between two strings.', examples: [{input: 'text1="abcde", text2="ace"', output: '3'}],
    starterCode: {
      python: `def lcs(t1, t2):\n    pass\n\nprint(lcs("abcde", "ace"))`,
      javascript: `function lcs(t1, t2) {\n}\nconsole.log(lcs("abcde", "ace"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint lcs(string t1, string t2) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you reconstruct and print the actual LCS string?"
  },
  coinChange: {
    id: 'coinChange', title: 'Coin Change', difficulty: 'Medium', tags: ['DP', 'BFS'],
    description: 'Given coin denominations and a target amount, return the fewest coins needed. Return -1 if impossible.', examples: [{input: 'coins=[1,5,10], amount=11', output: '2'}],
    starterCode: {
      python: `def coin_change(coins, amount):\n    pass\n\nprint(coin_change([1, 5, 10], 11))`,
      javascript: `function coinChange(coins, amount) {\n}\nconsole.log(coinChange([1, 5, 10], 11));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint coinChange(vector<int>& coins, int amount) { return -1; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "What's the minimum coins for amount=0? Build up from there.",
      clue: "dp[0]=0, rest=infinity. For each amount a: dp[a] = min(dp[a-c]+1) for each coin c where c<=a.",
      answer: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a: dp[a] = min(dp[a], dp[a-c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Can you solve this with BFS too?",
    testCases: [
      { call: 'return coinChange([1,5,10], 11);', expected: 2, label: 'coinChange([1,5,10], 11)' },
      { call: 'return coinChange([2], 3);', expected: -1, label: 'coinChange([2], 3) impossible' },
      { call: 'return coinChange([1], 0);', expected: 0, label: 'coinChange([1], 0)' }
    ]
  },
  longestIncreasingSubsequence: {
    id: 'longestIncreasingSubsequence', title: 'Longest Increasing Subsequence', difficulty: 'Medium', tags: ['DP', 'Binary Search'],
    description: 'Return the length of the longest strictly increasing subsequence.', examples: [{input: '[10,9,2,5,3,7,101,18]', output: '4'}],
    starterCode: {
      python: `def length_of_LIS(nums):\n    pass\n\nprint(length_of_LIS([10,9,2,5,3,7,101,18]))`,
      javascript: `function lengthOfLIS(nums) {\n}\nconsole.log(lengthOfLIS([10,9,2,5,3,7,101,18]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint lengthOfLIS(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Upgrade from O(n²) to O(n log n) using binary search.",
    testCases: [
      { call: 'return lengthOfLIS([10,9,2,5,3,7,101,18]);', expected: 4, label: 'lengthOfLIS([10,9,2,5,3,7,101,18])' },
      { call: 'return lengthOfLIS([0,1,0,3,2,3]);', expected: 4, label: 'lengthOfLIS([0,1,0,3,2,3])' },
      { call: 'return lengthOfLIS([7,7,7,7]);', expected: 1, label: 'lengthOfLIS([7,7,7,7])' }
    ]
  },
  jumpGame: {
    id: 'jumpGame', title: 'Jump Game', difficulty: 'Medium', tags: ['Array', 'Greedy', 'DP'],
    description: 'Given nums[i] = max jump length at position i, return true if you can reach the last index.', examples: [{input: '[2,3,1,1,4]', output: 'true'}],
    starterCode: {
      python: `def can_jump(nums):\n    pass\n\nprint(can_jump([2,3,1,1,4]))`,
      javascript: `function canJump(nums) {\n}\nconsole.log(canJump([2,3,1,1,4]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nbool canJump(vector<int>& nums) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Now try Jump Game II — minimum number of jumps."
  },
  houseRobber: {
    id: 'houseRobber', title: 'House Robber', difficulty: 'Medium', tags: ['DP'],
    description: 'Rob houses for max money without robbing two adjacent houses.', examples: [{input: '[2,7,9,3,1]', output: '12'}],
    starterCode: {
      python: `def rob(nums):\n    pass\n\nprint(rob([2,7,9,3,1]))`,
      javascript: `function rob(nums) {\n}\nconsole.log(rob([2,7,9,3,1]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint rob(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "At each house: rob it (skip previous) or skip it (keep previous max). What does dp[i] represent?",
      clue: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Only need last two values — O(1) space.",
      answer: `def rob(nums):\n    prev2 = prev1 = 0\n    for n in nums:\n        prev2, prev1 = prev1, max(prev1, prev2 + n)\n    return prev1`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Now try House Robber II — houses in a circle."
  },

  // ── Two Pointers ──
  containerWithMostWater: {
    id: 'containerWithMostWater', title: 'Container With Most Water', difficulty: 'Medium', tags: ['Array', 'Two Pointers'],
    description: 'Find two lines that form a container holding the most water.', examples: [{input: '[1,8,6,2,5,4,8,3,7]', output: '49'}],
    starterCode: {
      python: `def max_area(height):\n    pass\n\nprint(max_area([1,8,6,2,5,4,8,3,7]))`,
      javascript: `function maxArea(height) {\n}\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint maxArea(vector<int>& height) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Why move the shorter pointer inward?",
    testCases: [
      { call: 'return maxArea([1,8,6,2,5,4,8,3,7]);', expected: 49, label: 'maxArea([1,8,6,2,5,4,8,3,7])' },
      { call: 'return maxArea([1,1]);', expected: 1, label: 'maxArea([1,1])' }
    ]
  },
  trappingRainWater: {
    id: 'trappingRainWater', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers', 'Stack'],
    description: 'Given elevation map, compute how much water it can trap.', examples: [{input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6'}],
    starterCode: {
      python: `def trap(height):\n    pass\n\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))`,
      javascript: `function trap(height) {\n}\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint trap(vector<int>& height) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "Water at position i = min(maxLeft, maxRight) - height[i]. How to compute this efficiently?",
      clue: "Two-pointer: maintain leftMax and rightMax. Process the side with the smaller max.",
      answer: `def trap(height):\n    l, r = 0, len(height)-1\n    lm = rm = water = 0\n    while l < r:\n        if height[l] < height[r]:\n            lm = max(lm, height[l]); water += lm - height[l]; l += 1\n        else:\n            rm = max(rm, height[r]); water += rm - height[r]; r -= 1\n    return water`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Compare O(n) space prefix approach vs O(1) two-pointer."
  },
  threeSum: {
    id: 'threeSum', title: '3Sum', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Return all unique triplets that sum to zero.', examples: [{input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]'}],
    starterCode: {
      python: `def three_sum(nums):\n    pass\n\nprint(three_sum([-1,0,1,2,-1,-4]))`,
      javascript: `function threeSum(nums) {\n}\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<vector<int>> threeSum(vector<int>& nums) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Sort + fix one number, then use two pointers for the pair.",
    testCases: [
      { call: 'return threeSum([-1,0,1,2,-1,-4]);', expected: [[-1,-1,2],[-1,0,1]], label: 'threeSum([-1,0,1,2,-1,-4])' },
      { call: 'return threeSum([0,0,0]);', expected: [[0,0,0]], label: 'threeSum([0,0,0])' },
      { call: 'return threeSum([0,1,1]);', expected: [], label: 'threeSum([0,1,1])' }
    ]
  },

  // ── Backtracking ──
  subsets: {
    id: 'subsets', title: 'Subsets', difficulty: 'Medium', tags: ['Backtracking', 'Array'],
    description: 'Return all possible subsets (the power set).', examples: [{input: '[1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]'}],
    starterCode: {
      python: `def subsets(nums):\n    pass\n\nprint(subsets([1,2,3]))`,
      javascript: `function subsets(nums) {\n}\nconsole.log(subsets([1,2,3]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<vector<int>> subsets(vector<int>& nums) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you solve this iteratively?"
  },
  permutations: {
    id: 'permutations', title: 'Permutations', difficulty: 'Medium', tags: ['Backtracking'],
    description: 'Return all possible permutations of distinct integers.', examples: [{input: '[1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'}],
    starterCode: {
      python: `def permute(nums):\n    pass\n\nprint(permute([1,2,3]))`,
      javascript: `function permute(nums) {\n}\nconsole.log(permute([1,2,3]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<vector<int>> permute(vector<int>& nums) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Can you use swapping instead of a used array?"
  },
  nQueens: {
    id: 'nQueens', title: 'N-Queens', difficulty: 'Hard', tags: ['Backtracking'],
    description: 'Place n queens on an n×n board so no two attack each other.', examples: [{input: 'n=4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]'}],
    starterCode: {
      python: `def solve_n_queens(n):\n    pass\n\nprint(solve_n_queens(4))`,
      javascript: `function solveNQueens(n) {\n}\nconsole.log(solveNQueens(4));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nvector<vector<string>> solveNQueens(int n) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Track cols, diagonals (r-c), anti-diagonals (r+c) with sets."
  },

  // ── Greedy ──
  activitySelection: {
    id: 'activitySelection', title: 'Non-Overlapping Intervals', difficulty: 'Medium', tags: ['Greedy', 'Sorting'],
    description: 'Return the minimum intervals to remove to make the rest non-overlapping.', examples: [{input: '[[1,2],[2,3],[3,4],[1,3]]', output: '1'}],
    starterCode: {
      python: `def erase_overlap(intervals):\n    pass\n\nprint(erase_overlap([[1,2],[2,3],[3,4],[1,3]]))`,
      javascript: `function eraseOverlap(intervals) {\n}\nconsole.log(eraseOverlap([[1,2],[2,3],[3,4],[1,3]]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint eraseOverlap(vector<vector<int>>& intervals) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Sort by end time. Why is that the correct greedy choice?"
  },

  // ── Heap ──
  kthLargest: {
    id: 'kthLargest', title: 'Kth Largest Element', difficulty: 'Medium', tags: ['Heap', 'Sorting'],
    description: 'Find the kth largest element in an array.', examples: [{input: 'nums=[3,2,1,5,6,4], k=2', output: '5'}],
    starterCode: {
      python: `import heapq\ndef find_kth_largest(nums, k):\n    pass\n\nprint(find_kth_largest([3,2,1,5,6,4], 2))`,
      javascript: `function findKthLargest(nums, k) {\n}\nconsole.log(findKthLargest([3,2,1,5,6,4], 2));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint findKthLargest(vector<int>& nums, int k) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use a min-heap of size k, or QuickSelect for expected O(n)."
  },

  // ── Bit Manipulation ──
  singleNumber: {
    id: 'singleNumber', title: 'Single Number', difficulty: 'Easy', tags: ['Bit Manipulation', 'Array'],
    description: 'Every element appears twice except one. Find that single element in O(n) time, O(1) space.', examples: [{input: '[4,1,2,1,2]', output: '4'}],
    starterCode: {
      python: `def single_number(nums):\n    pass\n\nprint(single_number([4,1,2,1,2]))`,
      javascript: `function singleNumber(nums) {\n}\nconsole.log(singleNumber([4,1,2,1,2]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint singleNumber(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "XOR: a ^ a = 0, a ^ 0 = a. What if you XOR all numbers together?",
      clue: "XOR all numbers — paired numbers cancel to 0, leaving only the single number.",
      answer: `def single_number(nums):\n    res = 0\n    for n in nums: res ^= n\n    return res`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Extend to find the single number when others appear THREE times.",
    testCases: [
      { call: 'return singleNumber([4,1,2,1,2]);', expected: 4, label: 'singleNumber([4,1,2,1,2])' },
      { call: 'return singleNumber([2,2,1]);', expected: 1, label: 'singleNumber([2,2,1])' },
      { call: 'return singleNumber([1]);', expected: 1, label: 'singleNumber([1])' }
    ]
  },

  // ── Hard: DP Advanced ──
  editDistance: {
    id: 'editDistance', title: 'Edit Distance', difficulty: 'Hard', tags: ['DP', 'String'],
    description: 'Given two strings, return the minimum number of operations (insert, delete, replace) to convert one to the other.', examples: [{input: 'word1="horse", word2="ros"', output: '3'}],
    starterCode: {
      python: `def min_distance(w1, w2):\n    pass\n\nprint(min_distance("horse", "ros"))`,
      javascript: `function minDistance(w1, w2) {\n}\nconsole.log(minDistance("horse", "ros"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint minDistance(string w1, string w2) { return 0; }\nint main() { return 0; }`
    },
    hints: {
      nudge: "dp[i][j] = min edits to convert w1[0..i] to w2[0..j]. What are the 3 choices at each cell?",
      clue: "If w1[i]==w2[j]: dp[i][j]=dp[i-1][j-1]. Else: 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for delete, insert, replace.",
      answer: `def min_distance(w1, w2):\n    m,n = len(w1),len(w2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0]=i\n    for j in range(n+1): dp[0][j]=j\n    for i in range(1,m+1):\n        for j in range(1,n+1):\n            if w1[i-1]==w2[j-1]: dp[i][j]=dp[i-1][j-1]\n            else: dp[i][j]=1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])\n    return dp[m][n]`
    },
    socraticQuestions: defaultSocraticQuestions, refactor: "Can you optimize space to O(min(m,n))?"
  },
  medianTwoArrays: {
    id: 'medianTwoArrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Binary Search', 'Array'],
    description: 'Find the median of two sorted arrays in O(log(m+n)) time.', examples: [{input: 'nums1=[1,3], nums2=[2]', output: '2.0'}],
    starterCode: {
      python: `def find_median(nums1, nums2):\n    pass\n\nprint(find_median([1,3], [2]))`,
      javascript: `function findMedian(nums1, nums2) {\n}\nconsole.log(findMedian([1,3], [2]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\ndouble findMedian(vector<int>& a, vector<int>& b) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Binary search on the shorter array for O(log(min(m,n)))."
  },
  wordLadder: {
    id: 'wordLadder', title: 'Word Ladder', difficulty: 'Hard', tags: ['Graph', 'BFS', 'String'],
    description: 'Find the shortest transformation sequence length from beginWord to endWord, changing one letter at a time using a wordList.', examples: [{input: 'begin="hit", end="cog", wordList=["hot","dot","dog","lot","log","cog"]', output: '5'}],
    starterCode: {
      python: `def ladder_length(begin, end, word_list):\n    pass`,
      javascript: `function ladderLength(begin, end, wordList) {\n}`,
      cpp: `int ladderLength(string begin, string end, vector<string>& wordList) { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use bidirectional BFS for massive speedup."
  },
  sudokuSolver: {
    id: 'sudokuSolver', title: 'Sudoku Solver', difficulty: 'Hard', tags: ['Backtracking', 'Array'],
    description: 'Solve a 9x9 Sudoku puzzle by filling empty cells.', examples: [{input: '9x9 board with dots', output: 'Completed valid board'}],
    starterCode: {
      python: `def solve_sudoku(board):\n    pass`,
      javascript: `function solveSudoku(board) {\n}`,
      cpp: `void solveSudoku(vector<vector<char>>& board) {}`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use bitmasks for rows/cols/boxes to speed up validation."
  },
  longestValidParentheses: {
    id: 'longestValidParentheses', title: 'Longest Valid Parentheses', difficulty: 'Hard', tags: ['Stack', 'DP', 'String'],
    description: 'Find the length of the longest valid parentheses substring.', examples: [{input: '"(()"', output: '2'}, {input: '")()())"', output: '4'}],
    starterCode: {
      python: `def longest_valid(s):\n    pass\n\nprint(longest_valid(")()())"))`,
      javascript: `function longestValid(s) {\n}\nconsole.log(longestValid(")()())"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint longestValid(string s) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Solve with stack OR two-pass counter. Compare approaches."
  },
  maximalRectangle: {
    id: 'maximalRectangle', title: 'Maximal Rectangle', difficulty: 'Hard', tags: ['Stack', 'Array', 'DP'],
    description: 'Find the largest rectangle containing only 1s in a binary matrix.', examples: [{input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"]]', output: '6'}],
    starterCode: {
      python: `def maximal_rectangle(matrix):\n    pass`,
      javascript: `function maximalRectangle(matrix) {\n}`,
      cpp: `int maximalRectangle(vector<vector<char>>& matrix) { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Build histogram per row, then use Largest Rectangle in Histogram."
  },
  wordBreak: {
    id: 'wordBreak', title: 'Word Break', difficulty: 'Medium', tags: ['DP', 'String'],
    description: 'Given a string s and dictionary, return true if s can be segmented into space-separated dictionary words.', examples: [{input: 's="leetcode", dict=["leet","code"]', output: 'true'}],
    starterCode: {
      python: `def word_break(s, word_dict):\n    pass\n\nprint(word_break("leetcode", ["leet","code"]))`,
      javascript: `function wordBreak(s, wordDict) {\n}\nconsole.log(wordBreak("leetcode", ["leet","code"]));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nbool wordBreak(string s, vector<string>& dict) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "dp[i] = can s[0..i] be segmented? Check all dict words as suffixes."
  },

  // ── Hard: Graph Advanced ──
  alienDictionary: {
    id: 'alienDictionary', title: 'Alien Dictionary', difficulty: 'Hard', tags: ['Graph', 'Topological Sort'],
    description: 'Given a sorted dictionary of an alien language, derive the order of characters.', examples: [{input: '["wrt","wrf","er","ett","rftt"]', output: '"wertf"'}],
    starterCode: {
      python: `def alien_order(words):\n    pass`,
      javascript: `function alienOrder(words) {\n}`,
      cpp: `string alienOrder(vector<string>& words) { return ""; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Build a graph from adjacent word pairs, then topological sort."
  },
  courseSchedule: {
    id: 'courseSchedule', title: 'Course Schedule', difficulty: 'Medium', tags: ['Graph', 'BFS', 'DFS'],
    description: 'Given numCourses and prerequisites, determine if you can finish all courses (detect cycle in directed graph).', examples: [{input: 'n=2, prereqs=[[1,0]]', output: 'true'}],
    starterCode: {
      python: `def can_finish(n, prereqs):\n    pass\n\nprint(can_finish(2, [[1,0]]))`,
      javascript: `function canFinish(n, prereqs) {\n}\nconsole.log(canFinish(2, [[1,0]]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nbool canFinish(int n, vector<vector<int>>& prereqs) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use Kahn's algorithm (BFS) or DFS with coloring."
  },
  dijkstra: {
    id: 'dijkstra', title: 'Dijkstra Shortest Path', difficulty: 'Medium', tags: ['Graph', 'Heap'],
    description: 'Find the shortest path from source to all vertices in a weighted graph.', examples: [{input: 'V=5, src=0, edges with weights', output: '[0,4,12,19,21]'}],
    starterCode: {
      python: `import heapq\ndef dijkstra(graph, src):\n    pass`,
      javascript: `function dijkstra(graph, src) {\n}`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& graph, int src) { return {}; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Why doesn't Dijkstra work with negative weights?"
  },
  cloneGraph: {
    id: 'cloneGraph', title: 'Clone Graph', difficulty: 'Medium', tags: ['Graph', 'DFS', 'BFS'],
    description: 'Return a deep copy of a connected undirected graph.', examples: [{input: 'adj=[[2,4],[1,3],[2,4],[1,3]]', output: 'Same structure, new nodes'}],
    starterCode: {
      python: `def clone_graph(node):\n    pass`,
      javascript: `function cloneGraph(node) {\n}`,
      cpp: `Node* cloneGraph(Node* node) { return nullptr; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use a hash map to track cloned nodes."
  },

  // ── Design ──
  lruCache: {
    id: 'lruCache', title: 'LRU Cache', difficulty: 'Hard', tags: ['Design', 'Hash Map', 'Linked List'],
    description: 'Design a data structure for Least Recently Used (LRU) cache with O(1) get and put.', examples: [{input: 'cap=2, put(1,1), put(2,2), get(1), put(3,3), get(2)', output: '1, -1'}],
    starterCode: {
      python: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key): pass\n    def put(self, key, value): pass`,
      javascript: `class LRUCache {\n    constructor(cap) {}\n    get(key) {}\n    put(key, val) {}\n}`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int cap) {}\n    int get(int key) { return -1; }\n    void put(int key, int val) {}\n};`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use OrderedDict (Python) or doubly-linked list + hash map."
  },
  implementTrie: {
    id: 'implementTrie', title: 'Implement Trie', difficulty: 'Medium', tags: ['Design', 'Trie'],
    description: 'Implement a Trie with insert, search, and startsWith methods.', examples: [{input: 'insert("apple"), search("apple"), startsWith("app")', output: 'true, true'}],
    starterCode: {
      python: `class Trie:\n    def __init__(self): pass\n    def insert(self, word): pass\n    def search(self, word): pass\n    def startsWith(self, prefix): pass`,
      javascript: `class Trie {\n    constructor() {}\n    insert(word) {}\n    search(word) {}\n    startsWith(prefix) {}\n}`,
      cpp: `class Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) { return false; }\n    bool startsWith(string prefix) { return false; }\n};`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Each node has children map + isEnd flag."
  },

  // ── Array/Matrix ──
  rotateImage: {
    id: 'rotateImage', title: 'Rotate Image', difficulty: 'Medium', tags: ['Array', 'Matrix'],
    description: 'Rotate an n×n matrix 90 degrees clockwise in-place.', examples: [{input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]'}],
    starterCode: {
      python: `def rotate(matrix):\n    pass`,
      javascript: `function rotate(matrix) {\n}`,
      cpp: `void rotate(vector<vector<int>>& matrix) {}`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Transpose + reverse each row. Why does this work?"
  },
  spiralMatrix: {
    id: 'spiralMatrix', title: 'Spiral Matrix', difficulty: 'Medium', tags: ['Array', 'Matrix'],
    description: 'Return all elements of an m×n matrix in spiral order.', examples: [{input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]'}],
    starterCode: {
      python: `def spiral_order(matrix):\n    pass\n\nprint(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))`,
      javascript: `function spiralOrder(matrix) {\n}\nconsole.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> spiralOrder(vector<vector<int>>& m) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use top/bottom/left/right boundaries."
  },
  productExceptSelf: {
    id: 'productExceptSelf', title: 'Product Except Self', difficulty: 'Medium', tags: ['Array'],
    description: 'Return array where output[i] = product of all elements except nums[i], without division.', examples: [{input: '[1,2,3,4]', output: '[24,12,8,6]'}],
    starterCode: {
      python: `def product_except_self(nums):\n    pass\n\nprint(product_except_self([1,2,3,4]))`,
      javascript: `function productExceptSelf(nums) {\n}\nconsole.log(productExceptSelf([1,2,3,4]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> productExceptSelf(vector<int>& nums) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Left prefix product * right suffix product. O(1) extra space?"
  },

  // ── More Hard ──
  regexMatching: {
    id: 'regexMatching', title: 'Regular Expression Matching', difficulty: 'Hard', tags: ['DP', 'String'],
    description: 'Implement regex matching with . (any char) and * (zero or more of preceding).', examples: [{input: 's="aab", p="c*a*b"', output: 'true'}],
    starterCode: {
      python: `def is_match(s, p):\n    pass\n\nprint(is_match("aab", "c*a*b"))`,
      javascript: `function isMatch(s, p) {\n}\nconsole.log(isMatch("aab", "c*a*b"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nbool isMatch(string s, string p) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "dp[i][j] = does s[0..i] match p[0..j]? Handle * carefully."
  },
  serializeTree: {
    id: 'serializeTree', title: 'Serialize & Deserialize Tree', difficulty: 'Hard', tags: ['Tree', 'DFS', 'Design'],
    description: 'Serialize a binary tree to a string and deserialize it back.', examples: [{input: '[1,2,3,null,null,4,5]', output: '"1,2,null,null,3,4,null,null,5,null,null"'}],
    starterCode: {
      python: `class Codec:\n    def serialize(self, root): pass\n    def deserialize(self, data): pass`,
      javascript: `class Codec {\n    serialize(root) {}\n    deserialize(data) {}\n}`,
      cpp: `class Codec {\npublic:\n    string serialize(TreeNode* root) { return ""; }\n    TreeNode* deserialize(string data) { return nullptr; }\n};`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use preorder with null markers."
  },
  mergeIntervals: {
    id: 'mergeIntervals', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'],
    description: 'Merge all overlapping intervals.', examples: [{input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]'}],
    starterCode: {
      python: `def merge(intervals):\n    pass\n\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))`,
      javascript: `function merge(intervals) {\n}\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<vector<int>> merge(vector<vector<int>>& intervals) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Sort by start, then merge greedily."
  },
  search2DMatrix: {
    id: 'search2DMatrix', title: 'Search 2D Matrix', difficulty: 'Medium', tags: ['Binary Search', 'Matrix'],
    description: 'Search for a target in an m×n sorted matrix (each row sorted, first element > last of prev row).', examples: [{input: 'matrix=[[1,3,5,7],[10,11,16,20]], target=3', output: 'true'}],
    starterCode: {
      python: `def search_matrix(matrix, target):\n    pass`,
      javascript: `function searchMatrix(matrix, target) {\n}`,
      cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) { return false; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Treat the 2D matrix as a flat sorted array."
  },
  findMinRotated: {
    id: 'findMinRotated', title: 'Find Min in Rotated Array', difficulty: 'Medium', tags: ['Binary Search', 'Array'],
    description: 'Find the minimum element in a rotated sorted array.', examples: [{input: '[3,4,5,1,2]', output: '1'}],
    starterCode: {
      python: `def find_min(nums):\n    pass\n\nprint(find_min([3,4,5,1,2]))`,
      javascript: `function findMin(nums) {\n}\nconsole.log(findMin([3,4,5,1,2]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint findMin(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "What if there are duplicate elements?"
  },
  wordSearch: {
    id: 'wordSearch', title: 'Word Search', difficulty: 'Medium', tags: ['Backtracking', 'Matrix'],
    description: 'Given an m×n board and a word, find if the word exists in the grid (adjacent cells, no reuse).', examples: [{input: 'board=[["A","B"],["C","D"]], word="ABDC"', output: 'true'}],
    starterCode: {
      python: `def exist(board, word):\n    pass`,
      javascript: `function exist(board, word) {\n}`,
      cpp: `bool exist(vector<vector<char>>& board, string word) { return false; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "DFS from each cell, mark visited, backtrack."
  },
  combinationSum: {
    id: 'combinationSum', title: 'Combination Sum', difficulty: 'Medium', tags: ['Backtracking', 'Array'],
    description: 'Find all unique combinations of candidates that sum to target (can reuse elements).', examples: [{input: 'candidates=[2,3,6,7], target=7', output: '[[2,2,3],[7]]'}],
    starterCode: {
      python: `def combination_sum(candidates, target):\n    pass\n\nprint(combination_sum([2,3,6,7], 7))`,
      javascript: `function combinationSum(candidates, target) {\n}\nconsole.log(combinationSum([2,3,6,7], 7));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nvector<vector<int>> combinationSum(vector<int>& c, int target) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Sort first to prune branches early."
  },
  letterCombinations: {
    id: 'letterCombinations', title: 'Letter Combinations of Phone', difficulty: 'Medium', tags: ['Backtracking', 'String'],
    description: 'Given a string of digits 2-9, return all possible letter combinations.', examples: [{input: '"23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]'}],
    starterCode: {
      python: `def letter_combinations(digits):\n    pass\n\nprint(letter_combinations("23"))`,
      javascript: `function letterCombinations(digits) {\n}\nconsole.log(letterCombinations("23"));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nvector<string> letterCombinations(string digits) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Map each digit to its letters, then backtrack."
  },
  generateParentheses: {
    id: 'generateParentheses', title: 'Generate Parentheses', difficulty: 'Medium', tags: ['Backtracking', 'String'],
    description: 'Generate all valid combinations of n pairs of parentheses.', examples: [{input: 'n=3', output: '["((()))","(()())","(())()","()(())","()()()"]'}],
    starterCode: {
      python: `def generate(n):\n    pass\n\nprint(generate(3))`,
      javascript: `function generate(n) {\n}\nconsole.log(generate(3));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nvector<string> generate(int n) { return {}; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Track open/close counts. Only add ) if close < open."
  },

  // ── DP Medium ──
  uniquePaths: {
    id: 'uniquePaths', title: 'Unique Paths', difficulty: 'Medium', tags: ['DP', 'Math'],
    description: 'Count unique paths from top-left to bottom-right of an m×n grid (only right/down).', examples: [{input: 'm=3, n=7', output: '28'}],
    starterCode: {
      python: `def unique_paths(m, n):\n    pass\n\nprint(unique_paths(3, 7))`,
      javascript: `function uniquePaths(m, n) {\n}\nconsole.log(uniquePaths(3, 7));`,
      cpp: `#include <iostream>\nusing namespace std;\nint uniquePaths(int m, int n) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "dp[i][j]=dp[i-1][j]+dp[i][j-1]. Can reduce to O(n) space."
  },
  decodeWays: {
    id: 'decodeWays', title: 'Decode Ways', difficulty: 'Medium', tags: ['DP', 'String'],
    description: 'Given a digit string, count the number of ways to decode it (A=1..Z=26).', examples: [{input: '"226"', output: '3', note: 'BZ, VF, BBF'}],
    starterCode: {
      python: `def num_decodings(s):\n    pass\n\nprint(num_decodings("226"))`,
      javascript: `function numDecodings(s) {\n}\nconsole.log(numDecodings("226"));`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint numDecodings(string s) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "dp[i] = ways to decode s[0..i]. Check single and double digits."
  },
  partitionEqualSubset: {
    id: 'partitionEqualSubset', title: 'Partition Equal Subset Sum', difficulty: 'Medium', tags: ['DP', 'Array'],
    description: 'Can you partition the array into two subsets with equal sum?', examples: [{input: '[1,5,11,5]', output: 'true', note: '[1,5,5] and [11]'}],
    starterCode: {
      python: `def can_partition(nums):\n    pass\n\nprint(can_partition([1,5,11,5]))`,
      javascript: `function canPartition(nums) {\n}\nconsole.log(canPartition([1,5,11,5]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nbool canPartition(vector<int>& nums) { return false; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "This is 0/1 knapsack with target = totalSum/2."
  },
  targetSum: {
    id: 'targetSum', title: 'Target Sum', difficulty: 'Medium', tags: ['DP', 'Backtracking'],
    description: 'Assign + or - to each number to achieve the target sum. Count the ways.', examples: [{input: 'nums=[1,1,1,1,1], target=3', output: '5'}],
    starterCode: {
      python: `def find_target_sum_ways(nums, target):\n    pass\n\nprint(find_target_sum_ways([1,1,1,1,1], 3))`,
      javascript: `function findTargetSumWays(nums, target) {\n}\nconsole.log(findTargetSumWays([1,1,1,1,1], 3));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint findTargetSumWays(vector<int>& nums, int target) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Convert to subset sum: find subset with sum = (total+target)/2."
  },

  // ── Misc Essentials ──
  majorityElement: {
    id: 'majorityElement', title: 'Majority Element', difficulty: 'Easy', tags: ['Array'],
    description: 'Find the element that appears more than n/2 times.', examples: [{input: '[3,2,3]', output: '3'}],
    starterCode: {
      python: `def majority_element(nums):\n    pass\n\nprint(majority_element([3,2,3]))`,
      javascript: `function majorityElement(nums) {\n}\nconsole.log(majorityElement([3,2,3]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint majorityElement(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Boyer-Moore Voting: O(1) space, O(n) time."
  },
  missingNumber: {
    id: 'missingNumber', title: 'Missing Number', difficulty: 'Easy', tags: ['Array', 'Bit Manipulation', 'Math'],
    description: 'Given array containing n distinct numbers in [0,n], find the missing one.', examples: [{input: '[3,0,1]', output: '2'}],
    starterCode: {
      python: `def missing_number(nums):\n    pass\n\nprint(missing_number([3,0,1]))`,
      javascript: `function missingNumber(nums) {\n}\nconsole.log(missingNumber([3,0,1]));`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint missingNumber(vector<int>& nums) { return 0; }\nint main() { return 0; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Use sum formula OR XOR trick."
  },
  addTwoNumbers: {
    id: 'addTwoNumbers', title: 'Add Two Numbers', difficulty: 'Medium', tags: ['Linked List', 'Math'],
    description: 'Add two numbers represented as reversed linked lists.', examples: [{input: 'l1=[2,4,3], l2=[5,6,4]', output: '[7,0,8]', note: '342+465=807'}],
    starterCode: {
      python: `def add_two_numbers(l1, l2):\n    pass`,
      javascript: `function addTwoNumbers(l1, l2) {\n}`,
      cpp: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) { return nullptr; }`
    },
    hints: defaultHints, socraticQuestions: defaultSocraticQuestions, refactor: "Handle the carry when both lists are exhausted."
  }
};

const SKILLS = [
  { id: 'problemSolving', name: 'Problem Solving', icon: '🧩', xp: 120, maxXp: 300, color: '#6366f1' },
  { id: 'debugging', name: 'Debugging', icon: '🐛', xp: 80, maxXp: 200, color: '#22c55e' },
  { id: 'algorithms', name: 'Algorithms', icon: '⚡', xp: 95, maxXp: 300, color: '#f59e0b' },
  { id: 'dataStructures', name: 'Data Structures', icon: '🗃️', xp: 60, maxXp: 250, color: '#06b6d4' },
  { id: 'optimization', name: 'Optimization', icon: '🚀', xp: 40, maxXp: 200, color: '#a855f7' },
  { id: 'codeQuality', name: 'Code Quality', icon: '✨', xp: 70, maxXp: 200, color: '#ec4899' }
];

const ACHIEVEMENTS = [
  { icon: '🔥', label: '3-Day Streak' },
  { icon: '💡', label: 'First Hint Used' },
  { icon: '🦆', label: 'Duck Debugger' },
  { icon: '⚡', label: 'Speed Solver' }
];

const FLOWCHARTS = {
  python_loop: `flowchart TD
    A([Start]) --> B[Initialize variables]
    B --> C{Loop condition}
    C -->|true| D[Process element]
    D --> E{Check condition}
    E -->|match| F([Return result])
    E -->|no match| C
    C -->|false| G([Return default])`,
  python_recursive: `flowchart TD
    A([fib n]) --> B{Base case?}
    B -->|n≤1| C([return n])
    B -->|else| D[fib n-1]
    D --> E[fib n-2]
    E --> F([return sum])`,
  default: `flowchart TD
    A([Start]) --> B[Read input]
    B --> C[Process logic]
    C --> D{Valid result?}
    D -->|yes| E([Return output])
    D -->|no| F([Handle edge case])`
};
