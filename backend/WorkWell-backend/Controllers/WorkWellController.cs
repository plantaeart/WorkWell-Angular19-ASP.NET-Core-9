using System.Diagnostics;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using WorkWell_backend.Models;
using WorkWell_backend.Types.Enum;

namespace WorkWell_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkWellController : ControllerBase
{
    private readonly FirestoreDb _firestoreDb;
    private const string CollectionName = "WorkWell";
    private readonly ILogger _logger;

    public WorkWellController(IConfiguration configuration, ILogger<WorkWellController> logger)
    {
        string projectId = configuration["Google:ProjectId"] as string ?? throw new ArgumentNullException("ProjectId is not set in configuration.");
        _firestoreDb = FirestoreDb.Create(projectId);
        _logger = logger;
    }

    // GET: api/WorkWell/GetWorkWell
    [HttpGet("GetAllWorkWell")]
    public async Task<IActionResult> GetAllWorkWell()
    {
        var snapshot = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();
        List<WorkWell> workWellList = snapshot.Documents.Select(doc => doc.ConvertTo<WorkWell>()).OrderBy(workWell => workWell.IdWWS).ToList();
        return Ok(workWellList);
    }

    // GET: api/WorkWell/GetWorkWellById/{id}
    [HttpGet("GetWorkWellById/{idWWS}")]
    public async Task<IActionResult> GetWorkWellById(int idWWS)
    {
        // Query the collection for documents where idWWS matches the parameter
        var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
        var querySnapshot = await query.GetSnapshotAsync();

        if (querySnapshot.Documents.Count == 0)
            return NotFound($"(GetWorkWellById) No document found with IdWWS = {idWWS}");

        var document = querySnapshot.Documents.FirstOrDefault();

        if (document == null)
            return NotFound($"(GetWorkWellById) No document found with IdWWS = {idWWS}");
        else
        {
            var workWell = document.ConvertTo<WorkWell>();
            return Ok(workWell);
        }
    }

    // POST: api/WorkWell/CreateWorkWell
    [HttpPost("CreateWorkWell")]
    public async Task<IActionResult> CreateWorkWell([FromBody] WorkWell workWell)
    {
        // Get all documents in the collection
        var snapshot = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();

        // Determine the new idWWS
        int newIdWWS = 0;
        if (snapshot.Documents.Count > 0)
        {
            // Find the maximum idWWS value in the existing documents
            newIdWWS = snapshot.Documents
                .Select(doc => doc.ConvertTo<WorkWell>().IdWWS)
                .Max() + 1;
        }

        // Set the new idWWS for the WorkWell object
        workWell.IdWWS = newIdWWS;

        // Create a new document in Firestore
        var document = _firestoreDb.Collection(CollectionName).Document();
        await document.SetAsync(workWell);

        // Return the created document's details
        return CreatedAtAction(nameof(GetWorkWellById), new { idWWS = workWell.IdWWS }, workWell);
    }

    // PUT: api/WorkWell/UpdateWorkWell/{idWWS}
    [HttpPut("UpdateWorkWellById/{idWWS}")]
    public async Task<IActionResult> UpdateWorkWellById(int idWWS, [FromBody] WorkWell workWell)
    {
        // Query the collection for documents where idWWS matches the parameter
        var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
        var querySnapshot = await query.GetSnapshotAsync();

        if (querySnapshot.Documents.Count == 0)
        {
            return NotFound($"(UpdateWorkWellById) No document found with IdWWS = {idWWS}");
        }

        // Get the first matching document (assuming IdWWS is unique)
        var document = querySnapshot.Documents.FirstOrDefault();
        if (document != null)
        {
            // Update the document with the new data
            await document.Reference.SetAsync(workWell, SetOptions.Overwrite);
        }

        return NoContent();
    }

    // DELETE: api/WorkWell/DeleteWorkWell/{idWWS}
    [HttpDelete("DeleteWorkWellById/{idWWS}")]
    public async Task<IActionResult> DeleteWorkWellById(int idWWS)
    {
        // Query the collection for documents where idWWS matches the parameter
        var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
        var querySnapshot = await query.GetSnapshotAsync();

        if (querySnapshot.Documents.Count == 0)
            return NotFound($"(DeleteWorkWellById) No document found with IdWWS = {idWWS}");

        var document = querySnapshot.Documents.FirstOrDefault();
        if (document != null)
            await document.Reference.DeleteAsync();

        return NoContent();
    }

    // DELETE: api/WorkWell/DeleteMultipleWorkWell
    [HttpDelete("DeleteMultipleWorkWell")]
    public async Task<IActionResult> DeleteMultipleWorkWell([FromBody] int[] idWWSArray)
    {
        if (idWWSArray == null || idWWSArray.Length == 0)
        {
            return BadRequest("No IdWWS values provided.");
        }

        var deletedIds = new List<int>();
        var notFoundIds = new List<int>();

        foreach (var idWWS in idWWSArray)
        {
            // Query the collection for documents where idWWS matches the current id
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
            {
                notFoundIds.Add(idWWS);
                continue;
            }

            // Delete all matching documents (assuming IdWWS is unique, but handling multiple matches just in case)
            foreach (var document in querySnapshot.Documents)
            {
                await document.Reference.DeleteAsync();
                deletedIds.Add(idWWS);
            }
        }

        return Ok(new
        {
            DeletedIds = deletedIds,
            NotFoundIds = notFoundIds
        });
    }
}