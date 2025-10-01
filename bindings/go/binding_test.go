package tree_sitter_sbpf_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_sbpf "github.com/ivs-ug/tree-sitter-sbpf/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_sbpf.Language())
	if language == nil {
		t.Errorf("Error loading sBPF grammar")
	}
}
