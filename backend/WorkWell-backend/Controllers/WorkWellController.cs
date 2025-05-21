using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using WorkWell_backend.Models;

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
        try
        {
            var snapshot = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();
            List<WorkWell> workWellList = snapshot.Documents.Select(doc => doc.ConvertTo<WorkWell>()).OrderBy(workWell => workWell.IdWWS).ToList();
            return Ok(workWellList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // GET : api/WorkWell/GetIsPlayingWorkWell
    [HttpGet("GetPlayingWorkWell")]
    public async Task<IActionResult> GetPlayingWorkWell()
    {
        try
        {
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IsPlaying", true);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
                return NoContent();

            var workWellList = querySnapshot.Documents.Select(doc => doc.ConvertTo<WorkWell>()).FirstOrDefault();
            return Ok(workWellList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // GET: api/WorkWell/GetWorkWellById/{id}
    [HttpGet("GetWorkWellById/{idWWS}")]
    public async Task<IActionResult> GetWorkWellById(int idWWS)
    {
        try
        {
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
                return NotFound($"(GetWorkWellById) No document found with IdWWS = {idWWS}");

            var document = querySnapshot.Documents.FirstOrDefault();

            if (document == null)
                return NotFound($"(GetWorkWellById) No document found with IdWWS = {idWWS}");

            var workWell = document.ConvertTo<WorkWell>();
            return Ok(workWell);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // POST: api/WorkWell/CreateWorkWell
    [HttpPost("CreateWorkWell")]
    public async Task<IActionResult> CreateWorkWell([FromBody] WorkWell workWell)
    {
        try
        {
            var snapshot = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();

            int newIdWWS = 0;
            if (snapshot.Documents.Count > 0)
            {
                newIdWWS = snapshot.Documents
                    .Select(doc => doc.ConvertTo<WorkWell>().IdWWS)
                    .Max() + 1;
            }

            workWell.IdWWS = newIdWWS;

            var document = _firestoreDb.Collection(CollectionName).Document();
            await document.SetAsync(workWell);

            return CreatedAtAction(nameof(GetWorkWellById), new { idWWS = workWell.IdWWS }, workWell);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // PUT: api/WorkWell/UpdateWorkWell/{idWWS}
    [HttpPut("UpdateWorkWellById/{idWWS}")]
    public async Task<IActionResult> UpdateWorkWellById(int idWWS, [FromBody] WorkWell workWell)
    {
        try
        {
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
            {
                return NotFound($"(UpdateWorkWellById) No document found with IdWWS = {idWWS}");
            }

            var document = querySnapshot.Documents.FirstOrDefault();
            if (document != null)
            {
                await document.Reference.SetAsync(workWell, SetOptions.Overwrite);
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // PUT: api/WorkWell/UpdateIsPlayingWorkWell/{idWWS}
    [HttpPut("UpdateIsPlayingWorkWell/{idWWS}")]
    public async Task<IActionResult> UpdateIsPlayingWorkWell(int idWWS, [FromBody] bool isPlaying)
    {
        try
        {
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
                return NotFound($"(UpdateIsPlayingWorkWell) No document found with IdWWS = {idWWS}");

            var document = querySnapshot.Documents.FirstOrDefault();
            if (document != null)
            {
                var workWell = document.ConvertTo<WorkWell>();
                workWell.IsPlaying = isPlaying;
                await document.Reference.SetAsync(workWell, SetOptions.Overwrite);

                // Set as false for all other documents except the one updated
                var allDocuments = await _firestoreDb.Collection(CollectionName).GetSnapshotAsync();
                foreach (var doc in allDocuments.Documents)
                {
                    if (doc.Id != document.Id)
                    {
                        var otherWorkWell = doc.ConvertTo<WorkWell>();
                        otherWorkWell.IsPlaying = false;
                        await doc.Reference.SetAsync(otherWorkWell, SetOptions.Overwrite);
                    }
                }
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // PUT: api/WorkWell/UpdateIsLockedWorkWell/{idWWS}
    [HttpPut("UpdateIsLockedWorkWell/{idWWS}")]
    public async Task<IActionResult> UpdateIsLockedWorkWell(int idWWS, [FromBody] bool isLocked)
    {
        try
        {
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
                return NotFound($"(UpdateIsLockedWorkWell) No document found with IdWWS = {idWWS}");

            var document = querySnapshot.Documents.FirstOrDefault();
            if (document != null)
            {
                var workWell = document.ConvertTo<WorkWell>();
                workWell.IsLocked = isLocked;
                await document.Reference.SetAsync(workWell, SetOptions.Overwrite);
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // DELETE: api/WorkWell/DeleteWorkWell/{idWWS}
    [HttpDelete("DeleteWorkWellById/{idWWS}")]
    public async Task<IActionResult> DeleteWorkWellById(int idWWS)
    {
        try
        {
            var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
            var querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count == 0)
                return NotFound($"(DeleteWorkWellById) No document found with IdWWS = {idWWS}");

            var document = querySnapshot.Documents.FirstOrDefault();
            if (document != null)
                await document.Reference.DeleteAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    // DELETE: api/WorkWell/DeleteMultipleWorkWell
    [HttpDelete("DeleteMultipleWorkWell")]
    public async Task<IActionResult> DeleteMultipleWorkWell([FromBody] int[] idWWSArray)
    {
        try
        {
            if (idWWSArray == null || idWWSArray.Length == 0)
            {
                return BadRequest("No IdWWS values provided.");
            }

            var deletedIds = new List<int>();
            var notFoundIds = new List<int>();

            foreach (var idWWS in idWWSArray)
            {
                var query = _firestoreDb.Collection(CollectionName).WhereEqualTo("IdWWS", idWWS);
                var querySnapshot = await query.GetSnapshotAsync();

                if (querySnapshot.Documents.Count == 0)
                {
                    notFoundIds.Add(idWWS);
                    continue;
                }

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
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}