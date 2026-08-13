using AssignmentSystem.Api.Services;
using Xunit;

namespace AssignmentSystem.Tests;

public class PasswordHasherTests
{
    private readonly IPasswordHasher _hasher = new BCryptPasswordHasher();

    [Fact]
    public void Hash_ProducesADifferentStringThanTheOriginalPassword()
    {
        var hash = _hasher.Hash("Student@123");

        Assert.NotEqual("Student@123", hash);
        Assert.NotEmpty(hash);
    }

    [Fact]
    public void Verify_ReturnsTrue_WhenPasswordMatches()
    {
        var hash = _hasher.Hash("Student@123");

        Assert.True(_hasher.Verify("Student@123", hash));
    }

    [Fact]
    public void Verify_ReturnsFalse_WhenPasswordDoesNotMatch()
    {
        var hash = _hasher.Hash("Student@123");

        Assert.False(_hasher.Verify("WrongPassword", hash));
    }

    [Fact]
    public void Hash_ProducesDifferentHashesForTheSamePassword()
    {
        // BCrypt salts every hash, so two hashes of the same password
        // should never be identical - this is what makes rainbow tables
        // useless against it.
        var first = _hasher.Hash("Teacher@123");
        var second = _hasher.Hash("Teacher@123");

        Assert.NotEqual(first, second);
    }
}
