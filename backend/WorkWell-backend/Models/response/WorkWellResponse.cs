public class WorkWellResponse<T>
{
    public T? Data { get; set; } = default;
    public WorkWellErrorType? ErrorType { get; set; } = null;
    public string? ErrorMessage { get; set; } = null;
}