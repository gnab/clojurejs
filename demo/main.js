import './style.css'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { clojure } from "../src/clojure"

let editorState = EditorState.create({
    doc: `(defn new-list [] '())

(defn add-language [lang-list lang] 
  (conj lang-list lang))

(defn first-language [lang-list] 
  (first lang-list))

(defn remove-language [lang-list] 
  (rest lang-list))

(defn count-languages [lang-list]
  (count lang-list))

(defn learning-list []
  (-> (new-list)
      (add-language "Clojure")
      (add-language "Lisp")
      remove-language
      (add-language "Java")
      (add-language "JavaScript")
      count-languages))

(learning-list)`,
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
