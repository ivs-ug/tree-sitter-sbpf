/**
 * @file Solana sBPF Assembly
 * @author Ivan Sidorov <ivansid5.kz@proton.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'sbpf',

  extras: $ => [
    /[ \t\r\f]+/
  ],

  rules: {
    source_file: $ => repeat(choice(
      '\n',
      $.directive,
      $.label,
      $.instruction
    )),

    directive: $ => seq(
      '.',
      field('name', $.identifier),
      optional(field('value', choice($.identifier, $.immediate))),
      '\n'
    ),

    label: $ => seq(
      field('name', $.identifier), 
      ':',
      optional($.comment),
      '\n'
    ),

    instruction: $ => seq(
      choice(
        $.alu64_imm,
        $.alu64_reg,
        $.alu32_imm,
        $.alu32_reg,
        $.mov64,
        $.mov32,
        $.load_imm,
        $.load_mem,
        $.store_mem,
        $.jump_absolute,
        $.jump_conditional,
        $.call,
        $.exit,
        $.neg64,
        $.neg32,
        $.syscall
      ),
      optional($.comment),
      '\n'
    ),

    // ALU64 with immediate
    alu64_imm: $ => seq(
      field('op', alias(choice(
        'add64', 'sub64', 'mul64', 'div64', 'or64', 'and64', 'lsh64', 'rsh64', 'arsh64',
        'xor64', 'mod64', 'xchg64', 'cmpxchg64'
      ), $.mnemonic)),
      field('dst', $.register),
      ',',
      field('imm', $.immediate)
    ),

    // ALU64 with register
    alu64_reg: $ => seq(
      field('op', alias(choice(
        'add64', 'sub64', 'mul64', 'div64', 'or64', 'and64', 'lsh64', 'rsh64', 'arsh64',
        'xor64', 'mod64', 'xchg64', 'cmpxchg64'
      ), $.mnemonic)),
      field('dst', $.register),
      ',',
      field('src', $.register)
    ),

    // ALU32 with immediate
    alu32_imm: $ => seq(
      field('op', alias(choice(
        'add32', 'sub32', 'mul32', 'div32', 'or32', 'and32', 'lsh32', 'rsh32', 'arsh32',
        'xor32', 'mod32', 'xchg32', 'cmpxchg32'
      ), $.mnemonic)),
      field('dst', $.register),
      ',',
      field('imm', $.immediate)
    ),

    // ALU32 with register
    alu32_reg: $ => seq(
      field('op', alias(choice(
        'add32', 'sub32', 'mul32', 'div32', 'or32', 'and32', 'lsh32', 'rsh32', 'arsh32',
        'xor32', 'mod32', 'xchg32', 'cmpxchg32'
      ), $.mnemonic)),
      field('dst', $.register),
      ',',
      field('src', $.register)
    ),

    // Move 64-bit
    mov64: $ => seq(
      alias('mov64', $.mnemonic),
      field('dst', $.register),
      ',',
      field('src', choice($.register, $.immediate))
    ),

    // Move 32-bit
    mov32: $ => seq(
      alias('mov32', $.mnemonic),
      field('dst', $.register),
      ',',
      field('src', choice($.register, $.immediate))
    ),

    // Load immediate
    load_imm: $ => seq(
      field('op', alias(choice('lddw', 'ldw', 'ldh', 'ldb'), $.mnemonic)),
      field('dst', $.register),
      ',',
      field('imm', $.immediate)
    ),

    // Load from memory
    load_mem: $ => seq(
      field('op', alias(choice('ldxw', 'ldxh', 'ldxb', 'ldxdw'), $.mnemonic)),
      field('dst', $.register),
      ',',
      field('mem', $.memory_access)
    ),

    // Store to memory
    store_mem: $ => seq(
      field('op', alias(choice('stxw', 'stxh', 'stxb', 'stxdw'), $.mnemonic)),
      field('mem', $.memory_access),
      ',',
      field('src', choice($.register, $.immediate))
    ),

    // Jump absolute
    jump_absolute: $ => seq(
      alias('ja', $.mnemonic),
      field('target', choice($.label_ref, $.immediate))
    ),

    // Jump conditional
    jump_conditional: $ => seq(
      field('op', alias(choice(
        'jeq', 'jgt', 'jge', 'jlt', 'jle', 'jset', 'jne', 'jsgt', 'jsge', 'jslt', 'jsle'
      ), $.mnemonic)),
      field('src', $.register),
      ',',
      field('imm', choice($.register, $.immediate)),
      ',',
      field('target', choice($.label_ref, $.immediate))
    ),

    // Call
    call: $ => seq(
      alias('call', $.mnemonic),
      field('target', choice($.immediate, $.identifier))
    ),

    // Exit
    exit: $ => alias('exit', $.mnemonic),

    // Negate 64-bit
    neg64: $ => seq(
      alias('neg64', $.mnemonic),
      field('dst', $.register)
    ),

    // Negate 32-bit
    neg32: $ => seq(
      alias('neg32', $.mnemonic),
      field('dst', $.register)
    ),

    // Syscall
    syscall: $ => seq(
      alias('syscall', $.mnemonic),
      optional(seq('[', $.identifier, ']'))
    ),

    // Register names
    register: $ => /r(10|[0-9])/,

    // Immediate values
    immediate: $ => choice(
      /[-]?0x[0-9a-fA-F]+/,
      /[-]?\d+/
    ),

    // Memory access [r0+offset] or [r0-offset] or [r0]
    memory_access: $ => seq(
      '[',
      field('base', $.register),
      optional(seq(
        field('operator', choice('+', '-')),
        field('offset', $.immediate)
      )),
      ']'
    ),

    // Label reference
    label_ref: $ => $.identifier,

    // Identifier
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Comment - everything from current position to end of line (excluding the newline)
    comment: $ => /[^\n]+/
  }
});
