import {Prec} from '@codemirror/state'
import {keymap} from '@codemirror/view'
import {syntaxTree} from "@codemirror/language"
import {evalString} from "./interpreter"

const up = (node) => node.parent;
const isTopType = (nodeType) => nodeType.isTop
const isTop = (node) => isTopType(node.type)
const mainSelection = (state) => state.selection.asSingle().ranges[0]
const tree = (state, pos, dir) => syntaxTree(state).resolveInner(pos, dir)
const nearestTouching = (state, pos) => tree(state, pos, -1)

const children = (parent, from, dir) => {
    let child = parent.childBefore(from)
    return children(parent, child.from).unshift(child)
}

const parents = (node, p) => {
    if (isTop(node)) return p;
    return parents(up(node), p.concat(node))
}

const rangeStr = (state, selection) => state.doc.slice(selection.from, selection.to).toString()

// Return node or its highest parent that ends at the cursor position
const uppermostEdge = (pos, node) => {
    const p = parents(node, []).filter(n => pos == n.to && pos == node.to);
    return p[p.length - 1] || node
}

const nodeAtCursor = (state) => {
    const pos =  mainSelection(state).from
    const n = nearestTouching(state, pos)
    return uppermostEdge(pos, n)
}

let posAtFormEnd = 0

const topLevelNode = (state) => {
    const pos =  mainSelection(state).from
    const p = parents(nearestTouching(state, pos), [])
    if (p.length === 0) {
        return nodeAtCursor(state)
    } else {
        return p[p.length - 1]
    }
}

const cursorNodeString = (state) => rangeStr(state, nodeAtCursor(state))
const topLevelString = (state) => rangeStr(state, topLevelNode(state))

let evalResult = ""
let codeBeforeEval = ""
let posBeforeEval = 0

const updateEditor = (view, text, pos) => {
    const doc = view.state.doc.toString()
    codeBeforeEval = doc
    const end = doc.length
    view.dispatch({
        changes: {from: 0, to: end, insert: text},
        selection: {anchor: pos, head: pos}
    })
}

export function tryEval(s) {
    try {
        return evalString(s)
      } catch (err) {
        console.log(err)
        return "\nError: " + err.message
      }
}

export const clearEval = (view) => {
    if (evalResult.length != 0) {
        evalResult = ""
        updateEditor(view, codeBeforeEval, posBeforeEval)
    }
}

export const evalAtCursor = (view) => {
    clearEval(view)
    const doc = view.state.doc.toString()
    //console.log("doc:", doc)
    codeBeforeEval = doc
    posBeforeEval = view.state.selection.main.head
    const codeBeforeCursor = codeBeforeEval.slice(0, posBeforeEval)
    const codeAfterCursor = codeBeforeEval.slice(posBeforeEval, codeBeforeEval.length)
    evalResult = tryEval(cursorNodeString(view.state))
    const codeWithResult = codeBeforeCursor + " => " + evalResult + " " + codeAfterCursor
    updateEditor(view, codeWithResult, posBeforeEval)
    view.dispatch({selection: {anchor: posBeforeEval, head: posBeforeEval}})
    return true
}

export const evalTopLevel = (view) => {
    clearEval(view)
    posAtFormEnd = topLevelNode(view.state).to
    const doc = view.state.doc.toString()
    //console.log("doc:", doc)
    posBeforeEval = view.state.selection.main.head
    codeBeforeEval = doc
    const codeBeforeFormEnd = codeBeforeEval.slice(0, posAtFormEnd)
    const codeAfterFormEnd = codeBeforeEval.slice(posAtFormEnd, codeBeforeEval.length)
    evalResult = tryEval(topLevelString(view.state))
    const codeWithResult = codeBeforeFormEnd + " => " + evalResult + " " + codeAfterFormEnd
    updateEditor(view, codeWithResult, posBeforeEval)
    return true
}

export const evalCell = (view) => {
    clearEval(view)
    const doc = view.state.doc.toString()
    //console.log("doc:", doc)
    posBeforeEval = view.state.selection.main.head
    evalResult = tryEval(view.state.doc.text.join(" "))
    const codeWithResult = doc + "\n" + " => " + evalResult
    updateEditor(view, codeWithResult, posBeforeEval)
    return true
}

const alpha = Array.from(Array(58)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
let letterKeys = []
for (let i = 0; i < alphabet.length; i++) {
    letterKeys = letterKeys.concat({key: alphabet[i], run: clearEval})
}

export const evalExtension = 
     Prec.highest(keymap.of(
        [{key: "Shift-Enter", run: evalCell},
         {key: "Mod-Enter", run: evalAtCursor},
         {key: "Alt-Enter", run: evalTopLevel},
         {key: "Escape", run: clearEval},
         {key: "ArrowLeft", run: clearEval},
         {key: "ArrowRight", run: clearEval},
         {key: "ArrowUp", run: clearEval},
         {key: "ArrowDown", run: clearEval},
         {key: "Backspace", run: clearEval},
         {key: "Enter", run: clearEval},
         {key: "Tab", run: clearEval},
         {key: "Delete", run: clearEval},
         {key: "0", run: clearEval},
         {key: "1", run: clearEval},
         {key: "2", run: clearEval},
         {key: "3", run: clearEval},
         {key: "4", run: clearEval},
         {key: "5", run: clearEval},
         {key: "6", run: clearEval},
         {key: "7", run: clearEval},
         {key: "8", run: clearEval},
         {key: "9", run: clearEval},
         {key: "!", run: clearEval},
         {key: "@", run: clearEval},
         {key: "#", run: clearEval},
         {key: "$", run: clearEval},
         {key: "%", run: clearEval},
         {key: "^", run: clearEval},
         {key: "&", run: clearEval},
         {key: "*", run: clearEval},
         {key: "-", run: clearEval},
         {key: "=", run: clearEval},
         {key: "+", run: clearEval},
         {key: "/", run: clearEval},
         {key: "`", run: clearEval},
         {key: "\"", run: clearEval},
         {key: "'", run: clearEval},
         {key: ";", run: clearEval},
         {key: ":", run: clearEval},
         {key: "[", run: clearEval},
         {key: "]", run: clearEval},
         {key: "{", run: clearEval},
         {key: "}", run: clearEval},
         {key: "(", run: clearEval},
         {key: ")", run: clearEval},
         {key: "Space", run: clearEval}].concat(letterKeys)))
