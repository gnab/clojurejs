import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "../src/clojure"

let editorState = EditorState.create({
    doc: `(defn compute-across [func elements value]
  (if (empty? elements)
      value
      (recur func (rest elements) (func value (first elements)))))
      
(defn total-of [numbers]
   (compute-across + numbers 0))
      
(total-of [1 2 3 4 5])`,
    extensions: [basicSetup, clojure()]
})

new EditorView({
    state: editorState,
    parent: document.querySelector('#app')
}).focus()

let topLevelText = "Alt+Enter = Eval top-level form"
let keyBindings = "<strong>Key bindings:</strong>,Shift+Enter = Eval cell," +
    topLevelText + ",Ctrl/Cmd+Enter = Eval at cursor";
keyBindings = keyBindings.split(',');
for (let i = 0; i < keyBindings.length; i++)
    keyBindings[i] = "" + keyBindings[i] + "<br>";
keyBindings = keyBindings.join('');
document.getElementById("keymap").innerHTML = keyBindings;
