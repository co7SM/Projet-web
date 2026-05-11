<?php
namespace App\Http\Controllers;
use App\Models\Note;
use Illuminate\Http\Request;
class NoteController extends Controller
{
public function index(Request $request)
{
return response()->json($request->user()->notes);
}
public function store(Request $request)
{
$validated = $request->validate([
'title' => 'required|string|max:255',
'content' => 'required|string',
'urgency' => 'nullable|string'
]);
$note = $request->user()->notes()->create($validated);
return response()->json($note, 201);
}
public function update(Request $request, $id)
{
$note = $request->user()->notes()->findOrFail($id);
$validated = $request->validate([
'title' => 'required|string|max:255',
'content' => 'required|string',
'urgency' => 'nullable|string'
]);
$note->update($validated);
return response()->json($note);
}
public function destroy(Request $request, $id)
{
$note = $request->user()->notes()->find($id);
if (!$note) {
return response()->json(['message' => 'Unauthorized'], 404);
}
$note->delete();
return response()->json(['message' => 'Deleted']);
}
}