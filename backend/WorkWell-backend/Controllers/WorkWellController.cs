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

    public WorkWellController(IConfiguration configuration)
    {
        string projectId = configuration["Google:ProjectId"] as string ?? throw new ArgumentNullException("ProjectId is not set in configuration.");
        _firestoreDb = FirestoreDb.Create(projectId);
    }

    // GET: api/WorkWell/GetWorkWell
    [HttpGet("GetWorkWell")]
    public async Task<IActionResult> GetAllWorkWell()
    {
        var snapshot = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();
        var workWellList = snapshot.Documents.Select(doc => doc.ConvertTo<WorkWellSchedule>()).ToList();
        return Ok(workWellList);
    }

    // GET: api/WorkWell/GetWorkWellById/{id}
    [HttpGet("GetWorkWellById/{id}")]
    public async Task<IActionResult> GetWorkWellById(string id)
    {
        var document = _firestoreDb.Collection(CollectionName).Document(id);
        var snapshot = await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return NotFound();
        }

        var workWell = snapshot.ConvertTo<WorkWellSchedule>();
        return Ok(workWell);
    }

    // POST: api/WorkWell/CreateWorkWell
    [HttpPost("CreateWorkWell")]
    public async Task<IActionResult> CreateWorkWell([FromBody] WorkWellSchedule workWell)
    {
        var document = _firestoreDb.Collection(CollectionName).Document();
        workWell.IdDay = (WorkWellDayType)Enum.Parse(typeof(WorkWellDayType), document.Id); // Example of setting IdDay
        await document.SetAsync(workWell);
        return CreatedAtAction(nameof(GetWorkWellById), new { id = document.Id }, workWell);
    }

    // PUT: api/WorkWell/UpdateWorkWell/{id}
    [HttpPut("UpdateWorkWell/{id}")]
    public async Task<IActionResult> UpdateWorkWell(string id, [FromBody] WorkWellSchedule workWell)
    {
        var document = _firestoreDb.Collection(CollectionName).Document(id);
        var snapshot = await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return NotFound();
        }

        await document.SetAsync(workWell, SetOptions.Overwrite);
        return NoContent();
    }

    // DELETE: api/WorkWell/DeleteWorkWell/{id}
    [HttpDelete("DeleteWorkWell/{id}")]
    public async Task<IActionResult> DeleteWorkWell(string id)
    {
        var document = _firestoreDb.Collection(CollectionName).Document(id);
        var snapshot = await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return NotFound();
        }

        await document.DeleteAsync();
        return NoContent();
    }
}