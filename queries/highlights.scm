;; Mnemonics (instruction opcodes)
(mnemonic) @keyword

;; Registers
(register) @variable.builtin

;; Immediate values (numbers)
(immediate) @number

;; Labels
(label 
  (identifier) @label)

;; Label references
(label_ref 
  (identifier) @label)

;; Function names in call instructions
(call 
  (identifier) @function)

;; Directives
(directive 
  (identifier) @keyword.directive)

;; Memory access operators
(memory_access
  "[" @punctuation.bracket
  "]" @punctuation.bracket)

"+" @operator
"-" @operator

;; Punctuation
"," @punctuation.delimiter
":" @punctuation.delimiter

;; Comments
(comment) @comment
